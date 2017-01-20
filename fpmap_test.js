/* =======================================
  Copyright 2017 Panu Viljamaa   
  SPDX-License-Identifier: Apache-2.0
  ------------------------------------
  FILE: FpMapap/FpMapap_test.js
  Define and run the Tests for FpMapap.js .
  ========================================
 */
 
runTests();


return;

function runTests (FpMap)
{

  // 1. INSTALLATION
  // ===============
	// Loading or requiring  "FpMapap,js" does NOTHING
	// it has has NO side-effects. The require-expression
	// next will RETURN a function which you must call
	// ot actually get our map-function installed as
	// Function.prototype.map.

	// 1.0
	// Load the installer:
	var FpMap  = require("./fpmap");  // the installer


	var PossibleOtherVersion = Function.prototype.map;
	// Keep any possible existing version  in a variable
	// so we can restore it in the end, to leave the campsite
	// in its original state. We will reverse the above
	// assignment in the end.
	
	// 1.1
	// Now install the method Function.prototype.map
	// assuming it has not been installed already. If
	// it was, the followiong would cause an error.
  // If installation succeeds  every function will
  // have the method map().

	FpMap ();
	// Now all functions have the method map():
  ok (typeof (double.map)         === "function");
	ok (typeof (123 . toString.map)   === "function");
  // ok() is our simple assertion utility defined
	// at the end of the current file.


  // 1.2  
  // There's no error trying to install it
  // multiple times as long as the exact same
  // function gets stored as Function.prototype.map.
  // But see section 6 below for how to cause an error.
  FpMap ();
  FpMap ();
  ok (it.map);


	// 1.3 SOME FUNCTIONS WE WILL BE TESTING WITH:

	function it(arg)
	{ return arg;
	}
	function double (n)
	{ return n * 2;
	}
	function odd (n)
	{ if (n % 2) {return n}
	}
	function even (n)
	{ if (n % 2 === 0) { return n;}
	}


	// 2. MAPPING OVER ARRAYS
  // ======================
  // The functions double(), odd(), even(), it()
  // and ok() are defined at the end of this file.
   
  // 2.1 Transforming
	var doubled    = double.map([1,2,3]);
	ok(doubled[0] === 2);
	ok(doubled[1] === 4);
	ok(doubled[2] === 6);

  // 2.2 Filtering
	var odds    = odd.map([1,2,3]);
	ok(odds[0] === 1);
	ok(odds[1] === 3);
	ok(odds.length === 2);





  // 3. MAPPING OVER OBJECTS
  // =======================

  // 3.1 TRANSFORMING
  var doubleO  = double.map({x:1, y:2});
	ok(doubleO.x === 2);
	ok(doubleO.y === 4);
 
  // 3.1 FILTERING
  var oddOnly  = odd.map({x:1, y:2});
	ok(oddOnly.x === 1);
	ok(oddOnly.y === undefined);
 
  // Filters are functions which may return
  // undefined, such results are dropped
  // from the pipeline ASAP in effect
  // allowing us to keep just the results
  // we want, to pass on.



  // 4. MAPPING OVER FUNCTIONS
  // =========================

  // 4.1 TRANSFORMING
  var asIs = it.map(it); // it just returns its argument
	ok (asIs (34) === 34);
	
  var times2 = it.map(double);
	ok (times2(2) === 4);

	var times8 = double.map(double).map(double);
	ok (times8	(1) === 8);


  // 4.2 FILTERING
  var doubleOdds = odd.map(double);
  // First the external input is passed into to odd() 
  // then the result of that to double(), except
  // if odd() returned undefined.  
  // Note the order, data flows from left to right.
 
  ok (doubleOdds(0) === undefined);
  ok (doubleOdds(1) === 2);
  ok (doubleOdds(2) === undefined);
  ok (doubleOdds(3) === 6);
 
  var dods       = doubleOdds.map([1,2,3]);
  
  ok (dods[0]     === 2);
  ok (dods[1]     === 6); // skipped '2'
  ok (dods.length === 2);
   
  // What if we reverse the stages of this pipeline?
  doublesWhichAreOdd = double.map(odd);
  // There are no doubles which are odd
  // so the above function returns undefined 
  // for every number. Once you have doubled
  // something it can not be odd any more.
  ok (doublesWhichAreOdd(-1) === undefined);
  ok (doublesWhichAreOdd(0 ) === undefined);
  ok (doublesWhichAreOdd(1 ) === undefined);
  ok (doublesWhichAreOdd(2 ) === undefined);
  ok (doublesWhichAreOdd(3 ) === undefined);

   



  // 5. MAPPING OVER STRINGS
	// =======================
  //

  // 5.1
  // A simple example of what fpm can do which
  // is not so trivial or maybe even impossible
  // with RegExps. Maybe you can come up with
  // a RegExp that can do this, but the point
  // is our loop-function is easier to come
  // up with, easier to understand, debug and
  // to get right. (How do you debug regular
  // exporessions if they don't work like you
  // think they should?) .

  ok (titleCased.map("") === ""); 
  
  var s = titleCased.map("hello world now");
  ok (s === "Hello World Now");
  ok (titleCased.map(" hello ") === "Hello");


  // 5.2
  // A simple example whhic shows that the 
  // output can also be longer than the input.

  var s = doubleEveryChar.map("abcd") ;
  ok (s === "aabbccdd");

 
  // 5.3
  // fpm makes it easy to implement simple parsers,
  // this example shows how.  As you may be aware
  // RegularExpressions can not really for instance
  // parse HTML because when they see a closing tag
  // they don't really know which opening tag it
  // corresponds to. For more about this see:
  //  http://stackoverflow.com/questions/6751105/why-its-not-possible-to-use-regex-to-parse-html-xml-a-formal-explanation-in-la
 
   ok (parseDivs.map ("<div>", [])    === undefined);
   ok (parseDivs.map ("<div> a", [])    === undefined);

   ok (parseDivs.map ("a <div>", [])   === undefined);
   ok (parseDivs.map ("a <div> b", []) === undefined);
   // Above fails because there is opening tag 
   // but no closing tag.
  
   ok (parseDivs.map ("</div>"   , []) === undefined);
   ok (parseDivs.map ("a </div>" , []) === undefined);
   ok (parseDivs.map ("a </div>b", []) === undefined);
   // Above fail because there is closing tag but no opening tag.
   
   ok(parseDivs.map ("<div></div></div>", []) === undefined);
   ok(parseDivs.map ("<div></div></div>", []) === undefined);
   ok(parseDivs.map ("<div><div></div>" , []) === undefined);
   // Above fail because opening and closing tags are
   // not balanced.
     
   ok (parseDivs.map ("", []) === "");
   ok (parseDivs.map ("a b c", []) === "a b c");
   // above 2 succeed because there are no unbalanced
   // tags.
 
  var parseStack  = []; 
  var input       = "<div></div>";
  var output      = parseDivs.map (input, parseStack);
  var parseResult = parseStack[0];
  // the result is always the first and only element
  // of the array that was given as 2nd argument to map(),
  // it is the "this-argument" meaning it is the value
  // of 'this' inside map, which then gets also bound
  // as the 'this' inside the loop-funk.
   

  ok (output === input);
  ok (parseResult[0][0] === '<div>');
  ok (parseResult[0][1] === '</div>');
  // You might find it confusing why there are so many
  // levels of inner array. That is because each
  // open-close tag-pair becomes an Array of its own
  // with open tag as first element and close-tag as
  // last and possible contained wlements between,
  // which can be arrays or just a string.
  // The reason for all the levels is more clear if
  // you consider:
  var input = "<div></div><div></div>";
  // The above must produce as parse-result an 
  // array containing 2 arrays, one for each tag-pair.  
  var parseStack  = []; 
  var output        = parseDivs.map (input, parseStack);
  ok (output === input);
  var parseResult   = parseStack[0];
  ok (output === input);
  ok (parseResult[0][0] === '<div>');
  ok (parseResult[0][1] === '</div>');
  ok (parseResult[0][0] === '<div>');
  ok (parseResult[0][1] === '</div>');
 
 
  var parseStack  = []; 
  var sInput  = "<div> A B <div>A2 B2</div> C D </div>";
  var sOutput =  parseDivs.map (sInput, parseStack);
  ok (sInput === sOutput);
  var parseResult   = parseStack[0];

  ok(parseResult[0][0] 			=== "<div>");
  ok(parseResult[0][1] 			=== " A B ");
  ok(parseResult[0][2][0] 	=== "<div>");
  ok(parseResult[0][2][1] 	=== "A2 B2");
  ok(parseResult[0][2][2] 	=== "</div>");
  ok(parseResult[0][3] 			=== " C D ");
  ok(parseResult[0][4] 			=== "</div>");
  ok(parseResult[0].length  === 5);

  /*
  Note the above are the results of our very simple
  parser-function where we utilize the same
  array for both keeping the parsing state and
  returning the final state in the end. Therefore
  the result is an array containing one element
  which is an array, This has nothing to do with
  how Function.prototype.map(<String>) behaves.
  */
  
  // 5.4
  // One more non-trivial example that shows that
  // 1. We can use programmatic logic to come up
  //    with each replacement
  // 2. The output need not be of the same length
  //    as the input.
  
  var s = countXs.map("XAbXXcdX") ;
  ok (s === "Abcd4");
  var s = countXs.map("Abcd") ;
  ok (s === "Abcd0");

   
  function countXs (input, output, externalInput)
  { var result     = {};
    var inputC     = input[0];

    result.length  = 1; // always consume 1 char

    var totalXs     = externalInput.replace(/[^X]/g, "").length;
    var remainingXs = input        .replace(/[^X]/g, "").length;
    var replacedXs  = totalXs - remainingXs;
    var outputC     = inputC; // by default
    if (inputC === 'X')
    { outputC =  "";   
    }  
    if (input === "")
    { outputC = replacedXs + "";
    }
    result.toString
    = function () {return outputC};  
    return result;
    /**
    Function.prototype.map does not replace
    regular-exporessions but works well with 
    them to do stuff that could be difficult
    with only RegExps
    */
  }


  function doubleEveryChar (toConsume, consumed)
  { 
    if (toConsume === "")
    { return "";
      // else below toConsume[0]; would
      // produce incoherent results.
    }
    var char   = toConsume[0];
    var result = {};
    result.toString
    = function ()
      {return char + char
      };
   
    // By setting the length of the result
    // explicitly we control what will be the
    // next character to be consumed from the
    // input-string. That allows the output
    // to be of different length than the input
    // like in this case where we want to double 
    // every character.
    result.length =   1; // one more consumed
    return result;
  }

  function titleCased (toConsume, consumed)
  { if (! toConsume)
    { return "";
      // Every string-mapper function is called
      // with an empty consumable as a last round
      // in the end so it can have a final say of 
      // whether it thinks the result so far is
      // "good to go". WHat is returned from here
      // will be added to the results so far, so you
      // could for instance add a preiod at the
      // end of a sentence.  
  }
    var parts       = toConsume.split(/ /);
    var firstWord   = parts[0];
    var firstWordTC = firstWord[0].toUpperCase() 
                    + firstWord.slice(1);
    if (parts.length > 1)
    { firstWordTC += ' '; 
    }
    return  firstWordTC;   
  }



  function parseDivs (toConsume, consumed, allInput)
  {
    var stack         = this ;
    // stack.INCOMPLETE   = true;
    if (! stack || stack.constructor !== Array)
    { var m =  "parseDivs.map(<String>, <Array>) "
            +  "expects its 2nd argument to be an Array. "
            +  "invalid 2nd argument: " + stack;
      throw m;
    }
    var stackTopArray = null;
    var stackIsEmpty  = (stack.length === 0);
    if (stackIsEmpty)
    { stack.push([]);
    }     
    stackTopArray = stack[stack.length-1]; 
          
    // The bottom element of the stack will contain
    // the final parse-tree produced.  .
    
    var mOpenTag  = toConsume.match(/^\s*?<div>/);
    var mCloseTag = toConsume.match(/^\s*?<\/div>/);
    var mUptilTag   = toConsume.match(/^(.*?)</) ;
     
    // non-tag must be treated a little differently
    // we consume mUptilTag[1] so next time we are
    // ready to consume either an opening or
    // closaing tag.

    if (toConsume === "")
    {  
      if (stack.length > 1)
      { return undefined;
        // Parse-failure because all input has been
        // consumed and there are opened tags which
        // have not been closed.
      }
      // All opened tags have been closed and all
      // input has been consumed, so the parse
      // is complete and successful. Just return
      // "" to indicate everything is ok. 
      // This happens also if you try to parse
      // a string with no tags.
       return "";
    }

    if (mOpenTag)
    { 
      
      stack.push ( [mOpenTag[0]] );
      // we assume it is valid html
      // so don't need to consider error-cases.
      return   mOpenTag[0];
    }


    if (mCloseTag)
    { if (! stackTopArray)
      { debugger
       // means there was a closing tag with
       // no opening tag waiting for it.
       // Return undefined to indicate the
       // parse should fail, input is not
       // a valid sentence in this language.
       return undefined;

       // Note this here is just a sketch
       // of how to start building an HTML
       // or other type of parsers with fpm
       // so we're not saying no invalid
       // could possibly passed with this
       // particular draft of a parser. 
      } 
 
      if (stack.length < 2)
      { // measn there are no open tags pending.
        // so since now we encountered a closing
        // tag it meand the parse must fail.
        return undefined;
      }

      stackTopArray.push(mCloseTag[0]);
      var closedTopArray = stackTopArray;
    
      stack.pop(); // closing tag means this element is ready
      stackTopArray = stack [stack.length-1]; 
      if (! stackTopArray)
      { debugger    // should not come here
        return   mCloseTag[0];
      }
      stackTopArray.push(closedTopArray);
      return   mCloseTag[0];
    }
     
   if (mUptilTag)
    { stackTopArray.push(mUptilTag [1]);
      return   mUptilTag [1]; 
     //mUptilTag [1] is the part BEFORE '<'
    }
     /*  It is a string which ends the input
         without any < after it. That is the case
         if input has no tags in it. Or maybe
         it just ends in non-tags.

      */
    if (stack.length < 2)
    { return toConsume;
    }
 
    // There's open tag and then something which
    // is not closing tag, like: "<div> a"
    return undefined;
     
 }

  /*
 
  */



  // 6. RUNNING UNDER AN ALIAS TO AVOID POSSIBLE NAME-CONFLICTS
  // ==========================================================
	// You can install it under any name you wish, and you need to
	// if the method-name "map" was used for something else as
	// a property of Funciton.prototype.

	ok (! it.map7235); // does not exist so far
	FpMap ('map7235');
	ok (it.map7235);   // now it does.
	FpMap ('map7235');   // Installs the same thing again
	ok (it.map7235);

	var asIs			= it.map7235 (it);
	var times2		= it.map7235 (double);
	var times8    = double.map7235(double).map7235(double);
	ok (asIs		(34) === 34);
	ok (times2	(2 ) === 4);
	ok (times8	(1 ) === 8);


	// Trying to  overwrite and existing version
	// that is NOT THE SAME as the existing version
	// causes an error. To show that it does we first
	// us theta property for something else and show
	// then trying to install causes an error:

	FpMap ('map7235'); FpMap ('map7235');
 	// Above is ok because it re-installs the exact
	// same thing that existed there already. But
	// show that we get an error if that was not the case:

	Function.prototype.map7235 = it;
	var e2 = null;
	try
	{ FpMap ('map7235');
	} catch (e)
	{ e2 = e;
	}
	ok(e2.constructor === Error); // shows we got the error.

	Function.prototype.map7235 = undefined;
	// Now it is available again:
	FpMap ('map7235');
	Function.prototype.map7235 = undefined;




	// 7.CLEANUP
	// Leave the campsite like it was.

	Function.prototype.map     = PossibleOtherVersion;

  console.log ("FPM_test.js: ALL TESTS PASSED "
              + "\n	Function.prototype.map = "
              + Function.prototype.map
              );
	return;
} // end runTests()


// ------------------------------------------
// 8. TEST-ASSERTION UTILITY ok():

function ok (bool, msg)
{ msg = msg ? msg : "ok() failed";
  if(! bool)
  {  throw msg;
  }
  return true;
}





/* ======================================================
Copyright 2017 Panu Viljamaa

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

