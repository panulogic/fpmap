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
           + "' as Function.prototype.map "
           + " because that already exists "
           + " and has a different value. "
    throw new Error(em);
  }
  fp [methodName] = funkProtoMap;
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
    if (type === "object")
    { return funkProtoMap_object.call    (this, arg, thisArg);
    }
    throw "funkProtoMap() called with no argument or null";

      function funkProtoMap_string (aString, thisArg)
      { aString = (aString + "").trim();
        var produced      = "";
        var consumable    = aString;
        var nextIndex = 0;
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
        if (stringy === undefined)
        { debugger
          return undefined;
        }
        return produced;
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

      function funkProtoMap_function ($rightFunk, thisArg)
      { var $leftFunk = this;
        $thisArg = thisArg ? thisArg : this;
        return FUNK_MAPPED;

        function FUNK_MAPPED (vargs)
        { var args        = [].slice.call(arguments);
          var firstResult = $leftFunk.apply($thisArg, args);
          if (firstResult === undefined)
          { return undefined;
          }      
          var isArray 
          =  firstResult && (firstResult.constructor === Array);
          if (! isArray)
          { firstResult = [firstResult];
          }
          var result 
            = $rightFunk.apply ($thisArg, firstResult);
          return result;   
        }
      }
    }