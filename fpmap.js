/* =========================================
   Copyright 2017 Panu Viljamaa   
   SPDX-License-Identifier: Apache-2.0
   ------------------------------------
   FILE: fpmap/fpmap.js
   USAGE:  
   a) require ("fpmap") () 
   - Installs the funciton funkProtoMap() 
     defined below as the method "map" of 
     Function.prototype.

   b) require ("fpmap") ("map9")
   - Installs the same thing but as method "map9" 	
   
   See the associated tests-file fpmap_test.js
   for use-examples.
   ========================================= */

module.exports = fpm_installer;

function fpm_installer (methodName)
{ methodName = methodName ? methodName : 'map';
  var fp = Function.prototype;
  if (fp[methodName] === funkProtoMap)
  { return;
  }
  if (fp[methodName])
  { var em = "Can not install the method '"
           +  methodName 
           + "' to Function.prototype "
           + "because that already exists "
           + "and has the value: "
           + fp[methodName];

    throw new Error(em);
  }
  Object.defineProperty
 (fp, methodName, 
  { value       : funkProtoMap,
    writable    : false,
    enumerable  : false,
    configurable: false
 });

  ok (fp [methodName] === funkProtoMap);

  ok (fp [methodName] === funkProtoMap);

  return;
}

  function funkProtoMap (objectOrArrayOrFunctionOrString, thisArg)
  { var resultA, resultB;
    var arg = objectOrArrayOrFunctionOrString;
    if ( (arg === undefined)
      || (arg === null)
       )
    { throw "funkProtoMap() called with no argument or null";
    }
    var Ctor =  arg.constructor;
    var type =  typeof(arg);

    if (Ctor === String)
    { return funkProtoMap_string.call    (this, arg, thisArg);
    }
    if (Ctor === Array)
    { return funkProtoMap_array.call     (this, arg, thisArg);
    }
    if (Ctor === Function)
    { return funkProtoMap_function.call (this, arg, thisArg);
    }
    if (Ctor === Number)
    { return funkProtoMap_number.call (this, arg, thisArg);
    }
    if (Ctor === RegExp)
    { return funkProtoMap_reg.call (this, arg, thisArg);
    }
    if (type === "object")
    { return funkProtoMap_object.call    (this, arg, thisArg);
    }
    throw "funkProtoMap() called with invalid argument";

    function funkProtoMap_reg  ($regExp, $thisArg)
    { var $transformer = this;
      var $flags = $regExp.flags;
      if (! $flags.match(/g/))
      { $flags += 'g';
      }
      if ($thisArg)
      { return ALL_MATCHES.bind($thisArg);
      }
      return ALL_MATCHES;

      function ALL_MATCHES (inString)
      { var results = [];

        var $resultString       = "";
        var transformer         = $transformer;
        var reg                 = new RegExp ($regExp,  $flags);
        var lastProcessedIndex  = -1;
        var ix                  = 0;
        while (true)
        { ix++;  
          var m = reg.exec(inString);
          if (! m)
          { break;
          }
          var startOfMatch   = m.index;
          var startOfCopy    = lastProcessedIndex + 1;
          var skipped        = inString.slice (startOfCopy, startOfMatch);
          $resultString     += skipped;
          lastProcessedIndex = startOfMatch + m[0].length - 1;

          var aResult 
          = transformer.call (this, m, results, inString);
          if (aResult === undefined)
          { $resultString += (m[0] + "");
            continue; 
          }
          $resultString   += aResult + "";
          m._replacement   = aResult;
          m.toString       = replacementStringF;
          results.push(m);
        }
        var rest  = inString.slice
                    ( lastProcessedIndex + 1
                    , inString.length
                    );
        $resultString   += rest;
        results.toString = stringResultFunk;
        return results;

        function stringResultFunk ()
        { return $resultString;
        }

        function replacementStringF ()
        { return this._replacement + "";
        }
      }
    }

      function funkProtoMap_string (aString, thisArg)
      { aString = (aString + "").trim();
        var produced    = "";
        var consumable  = aString;
        var nextIndex   = 0;

        while (true)
        { var stringy
          = this.call 
            (thisArg, consumable, produced, aString);

          if (stringy === undefined)
          { return undefined;
          }
          produced  += stringy + "" ;      
          nextIndex += stringy.length;
          if (nextIndex >= aString.length)
          { consumable = "";
            var lastResult   = this.call 
             (thisArg, consumable, produced, aString);
            if (lastResult === undefined)
            { return undefined;
            }
            return produced + lastResult;
          }
          consumable = aString.slice (nextIndex); 
        }
      }

      function funkProtoMap_object (anObject, thisArg)
      { var result  = new anObject.constructor(); 
        for (var p in anObject)
        { var v = this.call (thisArg, anObject[p], p, anObject) ;
          if (v !== undefined)
          { result  [p] = v;
          }
        }
        return result;
      }

      function funkProtoMap_array (anArray, thisArg)
      { resultA = [].map.call  (anArray, this, thisArg);
        resultB = [];
        for (var j=0; j < resultA.length; j++)
        { var e = resultA[j];
          if (e !== undefined)
          { resultB . push(e);   
          }
        }
        return resultB;
       }

      function funkProtoMap_function ($rightFunk, $arg2)
      { var $leftFunk = this;
        if ( $rightFunk === Date)
        { return TIMER;
        }
        return FUNK_MAPPED;

        function FUNK_MAPPED (vargs)
        { var args        = [].slice.call(arguments);
          var firstResult = $leftFunk.apply(this, args);
          if (firstResult === undefined)
          { return undefined;
          }      
          var isArray 
          =  firstResult && (firstResult.constructor === Array);
          if (! isArray)
          { firstResult = [firstResult];
          }
          var result 
            = $rightFunk.apply (this, firstResult);
          return result;   
        }

        function TIMER ( argsToApply )
        { if (argsToApply === undefined)
          { argsToApply = [];
          }
          if (argsToApply === null)
          { argsToApply = [];
          }
          if (argsToApply.constructor !== Array)
          { argsToApply = [argsToApply];
          } 
          var times = $arg2;
          times = times ? times : 1;

          var start =  (new Date()).getTime();

          for (var j=0; j < times; j++)
          { $leftFunk.apply(this, argsToApply);
          }
          var end =  (new Date()).getTime();
          return end - start;
        }
      }
    }

function funkProtoMap_number ($noOfLoops)
{ var $leftFunk = this;
  return FUNK ;

  function FUNK  (firstArg, memory)
  { memory          = memory ? memory : [];
    if (firstArg === undefined)
    { firstArg = [];
    }
    var args        = [].slice.call(arguments);
    var leftFunk    = $leftFunk;
    var noOfLoops   = $noOfLoops;
    var nextArg     = firstArg;
    var mostRecentResult = undefined;

    for (var j = noOfLoops; j > 0; j--)
    { var v = leftFunk.call
              (this, nextArg, memory, firstArg);
      if (v === undefined)
      { return mostRecentResult; 
      } 

      mostRecentResult = v;
      nextArg          = v;
    }      

    return mostRecentResult;
  }
}

function ok (bool, msg)
{ msg = msg ? msg : "ok() failed";
  if(! bool)
  { throw msg;
  }
  return true;
}