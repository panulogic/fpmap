/* =======================================
  Copyright 2017 Panu Viljamaa   
  SPDX-License-Identifier: Apache-2.0
  ------------------------------------
  FILE: FpMapap/FpMapap_test.js
  Define and run the Tests for FpMapap.js .
  ========================================
 */
 

runTests();
console.log ("FPM_test.js: ALL TESTS PASSED "
            + "\nFunction.prototype.map === "
            + Function.prototype.map.name
            );
return;


function runTests (FpMap)
{ 
  testInstallation  ();
  testArrays        ();
  testObjects       ();
  testFunctions     ();
	testRegExp        ();
  testNumbers       ();
  testStrings       ();

  // cleanup:
  Function.prototype.map = undefined;
  return;

  function testInstallation ()
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
 
	
	// 1.1
	// Now install the method Function.prototype.map
	// assuming it has not been installed already. If
	// it was, the followiong would cause an error.
  // If installation succeeds  every function will
  // have the method map().

	FpMap ();
  var fpmap = Function.prototype.map;
  ok (fpmap); 
	// Now all functions have the method map():
  ok (double.map === fpmap);
  ok (typeof (double.map)         === "function");
	ok (typeof (123 . toString.map) === "function");
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


  // 1.3 RUNNING UNDER AN ALIAS TO AVOID POSSIBLE NAME-CONFLICTS
	// You can install fpmap under any name you wish, and you need to
	// if the method-name "map" was used for something else as
	// a property of Funciton.prototype.
  var name2 ='map7246533735';

	ok    (! it[name2]); // does not exist so far
	FpMap (name2);
	ok    (it[name2]);   // now it does.
  var fpmap2 =  it[name2];
  ok (fpmap2 === fpmap);

	var asIs			= it[name2] (it);
	var times2		= it[name2] (double);
	var times8    = double[name2](double)[name2](double);
	ok (asIs		(34) == 34);
	ok (times2	(2 ) == 4);
	ok (times8	(1 ) == 8);


	var fpmap = Function.prototype.map; 
	FpMap (name2); FpMap (name2);
 	// Above is ok because it re-installs the exact
	// same thing that existed there already. But
	// show that we get an error if that was not the case:

	Function.prototype[name2] = it; // HAS NO EFFECT
  // FpMap ('map7235') assigns the method
  // with Object.defineProperty() as a 
  // non-writable property. That has the effect
  // that the assignment now has no effect
  // even though there is no error either.
  ok (Function.prototype.map  === fpmap);
 
  // ==============================================
  // Next show that if the property already exists
  // in Functon.prototype, trying to install
  // fpmap() as a method with that namewill fail:
  var name3 = 'sdfggsdfdsfhaqweryhqehjkg';  
   
  Function.prototype[name3] = 123;
  var wasError = null;
  try 
  { FpMap(name3);
  } catch (e)
  { wasError = e;
    // console.log(e)
  }
  ok (wasError);
  
 }

  function testArrays ()
{
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


    }
 
  function testObjects ()
  {
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
  }
 
  function testFunctions ()
  {  
    
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

 }
   
  function testRegExp ()
  {
    // 7. Mapping over RegExp
	  // ======================
    // See the end of this section for
    // description of how it all works.
    // We start the description with a 
    // set of tests as examples:

 
  // 7.1 Finding ALL matches, replacing some 
  
  // Note, if you're not familiar with the
  // EcmaScript6 arrow-syntax, you may want
  // to skip this example for now and see the
  // next which uses the full function-syntax.
    
  var matchResults
  = (m=>m[0].toUpperCase()
    ).map(/a/) ("abcab");
     
  ok (matchResults.length == 2       );
  ok (matchResults[0]     == 'A'     );
  ok (matchResults[1]     == 'A'     );
  ok (matchResults        == "AbcAb" );
 
  
    
  // 7.2 Without Arrow-syntax
  // This example shows how we can also access  
  // the INDEX where each match happedn to affect
  // what the result of the match will be.
  // We also explain in detail what the results
  // above actually mean.

  function replacerFunkB (m, earlierResults, inputString)  
  { 
    var result = m[0]; 
    var ix     = m.index;
    if (ix == 0) 
    { return; // Skip match if it is the 
              // first char of the string.          
    }
    return m[0].toUpperCase() ; 
  } 
  
  var finderF      = replacerFunkB.map(/a/); 
  var matches      = finderF ("abcab");
  ok (matches.length   === 1  );
  // Only one match because the 'a' at the
  // start of the string was ignored because
  // replacerFunkB() reurned undefined for it.

  // The result of finderF() is now an
  // array of the matches returned by
  // exec() except those for which 
  // replacerFunkB() returned undefined.
  // Each such match includes all the 
  // information about the match including 
  // the index in the original string where 
  // it happened augmented which the info
  // about what it was replaced by.  So if
  // you want to debug and understand why
  // a given results were produced this
  // information gives you the information
  // you need to do that.

  // The result-array when converted to String
  // by explicitly or implicitly calling its
  // toString method gives you the string in
  // which all the replacements have been made:
  var resultString   = matches + ""; 
  ok (resultString   === "abcAb");

  // The same mechanism applies to the
  // individual elements of the matches
  // array, their toString() returns the
  // replacement that was used for that
  // particular match, so you can use a  
  // simple test like:
  ok (matches[0]        == 'A');
  // or you can write it out in full:
  ok (matches[0] + ''  === 'A');
      
  // The == above takes advantage of 
  // how == works in JavaScript:
  // It converts its operands to be of
  // same type.  Meaning the 2nd argument is
  // automatically converted to String 
  // in this case. Meaning its toString()
  // called which now has our custom 
  // implementation
 
  ok (matches[0].index        === 3  );
  ok (matches[0]._replacement === "A"); // same as matches[0] + ''
  ok (matches[0][0]           === "a"); // original match
  ok (matches  == "abcAb");
 


  // 7.3 Replacing matches
  
  // Example:
  ok ( (m=>m[0].toUpperCase()
       ).map(/a/) ("abcab") 
       == "AbcAb"
     );

  // A more spelled-out examnple:
  var pattern =  /\ba\w+/   ;
  //  \b matches word-boundary.
  //  \w+ matches 1 or more word-characters.

  var replacer = upperizer.map (pattern);
  var reps     = replacer ('xa a ab ac');
   
  ok (reps + "" ===  "xa a AB AC");
  // 'xa' not replaced because it is not a word
  // starting with 'a'.
  // 'a' not replaced because 'a' is followed
  // by space which is not a word-character. 
  // 'ab' and 'ac' match the pattern and are
  // replaced with the uppercase version of the
  // matched part giving us AB and AC. The
  // individual replacements made are available as:

  ok (reps[0]     == "AB");
  ok (reps[1]     == "AC");
  ok (reps.length == 2   );  

  function upperizer (eachMatch)
  {  return eachMatch[0].toUpperCase();
  }


 // 7.4 Dealing with no matches
  
  // If there are no matches, the result is
  // an empty array. That means it can still
  // be processed as is with a call to 
  // Array.prototype.map() without us knowing
  // whether there were any matches in the reult.
    
  var uppers = (x=>x[0]).map (/a/)("b")
                        .map (x=>x.toUpperCase());
  ok (uppers.length  == 0);
   

  // 7.4 Calculating replacements that depend
  //     on the matches found so far 
  var aPat        =  /a/   ;
  var replacer    = eachPlusCount.map (aPat);
    
  ok (replacer ('babxac')  == "bA[0]bxA[1]c" );
  ok (replacer ('aaa')     == "A[0]A[1]A[2]" );

  function eachPlusCount (eachMatch, doneReplacements  )
  { var s = eachMatch[0].toUpperCase() 
          + "[" + doneReplacements.length + "]";
    return s;
  }
 

  // 7.5 Using Matching Groups 
  // 
  // Find the digits following each 'N':
  var finderF   = (x=>x[1]).map (/N(\d+)/); 
  var ms        = finderF("N57 and N6. Not");
  ok (ms[0]     == '57');
  ok (ms[1]     ==  '6');
  ok (ms.length ===  2  );

  ok (ms == "57 and 6. Not");
  // The replacements were the (\d+),
  // each /N(\d+)/ was replaced by that. 
  // Therefore the Ns from in front of 
  // digits have disappeared, but not  
  // the 'N' in "Not".
   


  // 7.6  So what is new?
   
    /*    
    In standard JavaScript there already exists
    a nifty trick to combine RegExps with a function,
    to programmatically determine replacements,
    as seen by the  standardTest() example below.

    By making the replacer-function also manipulate
    variables in its outer scope it can collect 
    the matches and replacements into arrays so 
    each replacement can depend on the previous ones
    and in the end you can have an array containing 
    all the matches.
*/
   function standardTest (inputString) 
   { return inputString.replace
      (/([a-z])([a-z])([a-z])/g, replacerF 
       // match 3-letter groups
      );
    function replacerF (match, g1, g2, g3) 
    { return '<' + g1 + match.toLowerCase() + g3  + ">";
    }
  }
  var temp = standardTest('longer word no?');
  ok (temp === "<llonn><ggerr> <wworr>d no?");  


    /*
    What fmap(/regexp/) cam do more than using 
    standard replace() with a function-argument
    as above: 

    7.6.1. Fewer outer-scope variabloes.
    
    fpmap(/regexp/) allows  you to program in a 
    more functional style without relying on 
    keeping the state of matching in outer-scope  
    variables. 
    
    Unlike the standards-based example above 
    fpmap(<RegExp>) returns a function which 
    can be used as part of a pipeline of functions
    
    funkA.map(funkB)
         .map(/some regexp/)
         .map(funkC)
    
    And because fpmap(<RegExp>) returns all matches 
    including information about the replacement as
    an array than can easily be passed to further 
    call to Array.prototype.map() to process the 
    results further, like:
    
    funkA.map(/some regexp/)
         .map(arrayMapper)
         .map(arrayMapper2)
  

    7.6.2 Full access to state of the 
          matching-operation both during  
          and after the operation.

    The standard replace() with-function gives
    your function each match as arguments including 
    each match-group.  

    fpmap(<String>) gives your replacer-function
    3 arguments as in the example
    replacerFunkB (m, earlierResults, inputString)  

    1. The original result of exec() which
       includes the index at which the match
       happened in the input-string. As was  
       shown in example 7.2 earlier this index
       can be used to decide what what to do
       about each individual matc based on its
       position in the input-string.

    2. All match-results so far. These are
       arrays that were the result of RegExp.exec() 
       which now are augmented to contain the field 
       '_replacement' that tells what each match
       was replaced by. The output of current
       match can thus depend on the previous ones.
      
    3. The full original input-string -argument
       Because your replacer-function has also
       the index of the current match, your
       replacer-function can look forwards
       and backwards in the full input string
       to decide how to handle any given match.
    
    4. When the mathing is complete you have access 
       to each match-record including what the match 
       was replaced by. This can greatly facilitate
       understanding why the result came out to be
       what it is, and could also be used as input  
       for further processing.

      
    7.6.3 Creating A Reusable Function
        
    Calling fpmap(<RegExp>) returns a FUNCTION, 
    which you can then reuse repeatedly in any 
    number of places, pass as argument to further
    functions, and reuse to "parse" any number of 
    input-strings. 
    
    Compare the code required by the fpmap() 
    -example next followed by how the same thing 
    could be done with the standard JavaScript 
    'replace()':
    
    var f = replacerFunk.map(regexp);
    var a = f (stringA);
    var b = f (stringB);
    var c = f (stringC);
    // vs.
    var a = stringA.replace (regexp, replacerFunk);
    var b = stringB.replace (regexp, replacerFunk);
    var c = stringC.replace (regexp, replacerFunk);

    Apart for consiusting of about half the size
    of code needed, the f() produced by the first 
    line above can be used as argument to other 
    functions, or could be installed as a method 
    of an object-instane or prototype.
   
    Of course if your match-operation is 
    once only the standard machinery may
    be all you need.


    7.6.4 Producing Objects as Output
    
    Using the standard replace + replacer-function
    the function is expected to return a string
    that is is used to replace the match in the
    input-string.

    With fpmap<RegExp> we have so far only 
    provided examples wherre result of each
    call to the replacer was an Array similar
    to what is reurned by RegExp.exec(), 
    augmented with a custom toString() -method.

    Since we return an Array from each call
    and all such arrays are combined into 
    a container-array in the end it is easy
    to see that we might as well return
    non-array objects. We might not be interested
    in making replacements in the input-string,
    but rather use it as input fpor creating
    instances of our classes. Our final example
    whos how to do just that. Of course you could
    use the standard RegExp APIs do a similar thing
    yourself, the point is we make it rather
    easy do a thing like that with fpmap(<RegExp>).

   */

    // 7.7 Creating Class-Instances 

    var dogString  
    = "<dog> name: Fido</dog> <dog>name:Fifi </dog>";
    var dogPattern
    = /\<dog\>(\s*name:\s*)(.*?)\s*\<\/dog\>/ ;
 
    var dogParse   = createDog.map (dogPattern);
    var dogs       = dogParse (dogString)
                     . map(x => x._replacement);

    ok (dogs[0].name() === "Fido");
    ok (dogs[1].name() === "Fifi");    
    debugger
    
    /* HOW THE ABOVE WORKS:
    The replacer-function createDog() below
    gets called for each match and returns 
    an instance of Dog for each.
    
    The result from the replacer-function 
    however is embedded into the larger struture 
    representing the whole match. The replacement
    is in its field '_replacement'. The result
    of dogParse(...) is the array of all such
    match-structs.  
    
    Calling the method .map()  on the matches-Array 
    with the small lambda-function x => x._replacement 
    extracts all the replacements (which now 
    are) dog-instances into an Array of its own.
    Each element of it then has it method
    name() we can call upon.
    
    */

    function createDog (match, previousResults)
    { var name = match[2]; // the 2nd (group)
      var dog  = new Dog({name: name});
      dog.name(); // it has that method
      return dog;
    }

    function Dog (data)
    { this._data = data;
      this.name     
      = function (){return this._data.name};
    } 


    /* -----------------------------------------
     DOC: HOW fmap(/regexp/) WORKS:

     The statements: 
       var mappedRegExpF = replacerFunk.map (/regexp/);
       var matches       = mappedRegExpF (inputString) ;
       var resultString  = matches + '';
     
     are executed as follows: 

    1. replacerFunk.map (/some regexp/) causes the
       creation of the function mappedRegExpF() .
       mappedRegExpF() can then be called with 
       a String -argument to find matches of /regexp/
       in that, and to produce a string where each 
       matched portion is replaced by a string 
       calculated produced by the replaceFunk() 
       when it gbets called with each match produced 
       by /regexp/.exec(inputString) .
     
    For each call to mappedRegExpF():
    2. A new regexp regexp2 is created from /some regexp/
       which will have the g-flag set, so it can find
       multiple macthes, while rembering its position
       in the string it is streaming over.
     
    3. regexp2 .exec(inputString) is called in a loop
       until it returns undefined. For each match m
       returned by exec(): 

       3.1  Result of  replacerFunk(m) is stored into the
            results-array, unless undefined, which are
            ignored as if the corresponding match never 
            occurred.
       
       3.2  The  replacerFunk(m) + "" is used to replace
            the part matched by m in the inputString,
            and result is added to a transformedString
            containing all previously transformed and
            non-matched parts. 
      
            Thus parts found to match the arg-pattern are
            transformed as directed by the replacer-function,
            all non-matched parts of the input-string are 
            copied to the result-string as is.
   
     3. The toString() -method of the results-array 
        is set to a function which returns the transformed
        string produced above. The results-array is
        then returned. Thus the results give you both the
        array of replacement-objects, and the result of
        applying them to the input-string, if you execute
        resultsArray + "";
    */

}  
 
  function testNumbers ()
  {
// 6. MAPPING OVER NUMBERS
// =========================
// Calling aFunction.map() with number N
// returns a new function which will call
// 'aFunction' N times always passing the
// result of the previous call as argument
// to the next. 
// 
// IF the function takes as argument and 
// returns an array this is a convenient
// idiom for producing an array of objects
// or any type of object for that matter.
//
// THEREFORE if no initial argument is given
// the empty array [] will be used as default.
       
 
// Would it not be simpler to just return the 
// array directly? Yes if all we want is arrays.
// But by returning a function it can take
// any type of argument required, assuming 
// it also reurns a similar type of object.


// 6.1 Fixed-distance numeric series

  function oneToN (anArray)
	{ anArray.push (arr.length + 1) ;
		return anArray ;
	}
	
  var oneTo100 =  oneToN.map(100) ();
  ok (oneTo100.length === 100);
  ok (oneTo100[0]     === 1);
  ok (oneTo100[1]     === 2);
  ok (oneTo100[99]    === 100);
 
 

//   6.2 Generating Factorials
//
// In the previous example we generated
// a series of numbers with the distance
// of 1 between them. To produce more
// elaborate number-series that is a good
// starting point since it allows us to have
// a set of arguments with which to call
// any other function taking a number as argument.

// Note that in the follonmg example we are in
// fact NOT "mapping with numbers", we are using
// hte earlierly tested idiom of funk.map(array).
// But to create that array we took advantage of
// beionmg able to create it with oneToN.map(100) ()

  var facts      = fact.map(oneTo100);
     
	ok (facts[0] 	=== 1 );
	ok (facts[1] 	=== 2 );
	ok (facts[2] 	=== 6);
	ok (facts[3] 	=== 24);
	ok (facts[17] === 6402373705728000);

	function fact(n)
  { if (n < 2)
    {  return 1;
    }
    return n * fact(n-1);
  }
 


  // 6.3 Fibonacci numbers
  // An example of non-fixed interval series.
  // This differs form the factorials example
  // in taht we are not calling an existing function
  // like fact(n) to produce the factorial for different
  // arguments n.
  // Rather we are using the fact the

  // SEE: https://en.wikipedia.org/wiki/Fibonacci_number
  // 0, 1, 1, 2, 3, 5
  var fibonacci = getFibonacciFunk ();
  ok (fibonacci(0)  === 0);
  ok (fibonacci(1)  === 1);
  ok (fibonacci(2)  === 1);
  ok (fibonacci(3)  === 2);
  ok (fibonacci(4)  === 3);
  ok (fibonacci(5)  === 5);
  ok (fibonacci(6)  === 8);
  ok (fibonacci(7)  === 13);
  ok (fibonacci(8)  === 21);
  ok (fibonacci(9)  === 34);
  ok (fibonacci(10) === 55);
   
  // Test that the order in which we 
  // ask them does not matter. Everytime
  // we ask getFibonacciFunk () we get
  // a new verison with empty results-cache.
   var fibonacci = getFibonacciFunk ();
   ok (fibonacci(1)  === 1);
   ok (fibonacci(0)  === 0);
   ok (fibonacci(2)  === 1);
   ok (fibonacci(3)  === 2);
   
   var fibonacci = getFibonacciFunk ();
   ok (fibonacci(10) === 55);
   ok (fibonacci(3)  === 2);
   ok (fibonacci(1)  === 1);
   ok (fibonacci(0)  === 0);
   ok (fibonacci(2)  === 1);
  
   var fibonacci = getFibonacciFunk ();
   ok (fibonacci(2) === 1);
   ok (fibonacci(0) === 0);
   ok (fibonacci(3) === 2);
   ok (fibonacci(1) === 1);
   ok (fibonacci(4) === 3);
   ok (fibonacci(5) === 5);
   ok (fibonacci(6) === 8);
   ok (fibonacci(7) === 13);
   ok (fibonacci(8) === 21);
 
     
 function getFibonacciFunk ()
 { var $resultsCache = [];
  
   return fibonacciF;


  function fibonacciF  (n)
  { var resultsCache = $resultsCache;
    // BAD BUG. Below we did:
    // var $resultsCache = repeater ($resultsCache);
    // Using the var shadowed the outer-scope variable.
 
    if ($resultsCache [n] !== undefined)
    { return $resultsCache [n]; 
      // fibo(1) = 0 because the 
      // sum of 2 previous ones is 0.
         
      // resultsCache[0] === fibonacci(0)
      // resultsCache[1] === fibonacci(1)
    }
    if (n === 0)
    { // because we are here we know it is not in the
      // results-cache. We must add it there for
      // later numbers to get cacluclated.
      $resultsCache = [0,1]; 
      return 0;
    }
    if (n === 1)
    { // because we are here we know it is not in the
      // results-cache. We must add it there for
      // later numbers to get cacluclated.
      $resultsCache = [0,1]; 
      return 1;
    }

    var needed   = n - $resultsCache.length + 1 ;
    // if you start by asking  fibonacci(0)
    // we still need to create the 0th element
    // in the cache so that conveniently the
    // index in the cache tells which argument's
    // fibonacci it contains.
    // Above is all that is needed. But we could
    // guess that we will be needing more of them
    // soon enough, so calculate a few more.
    // tested that it works without adding anything
    // to needed as well. But now see this also works.
    needed = needed + 3;

    var repeater = manyFibocs.map(needed);
 
    // var $resultsCache = repeater ($resultsCache);
    // above bad bug. Must be:

    $resultsCache = repeater ($resultsCache);
    var fiboN = $resultsCache[n];
      
    return fiboN;  

    // the trick is:
    // manyFibocs () must be given ALL HTE ALREADY
    // CREATED NUMBERS AS ARGUMENT.
    // then the same manyFibocs(n)() will
    // produce n more results.

    // todo: more efficient way where I have an inner
    // function that memoizes the already caclulated
    // value in anarray, reurns a value from it
    // if it exists and if not adds more numbers
    // to it until we have enough.

  }
   
  function manyFibocs  (series)
  { // This gets called repeatedly with my caller
    // passing the previous result here as argument,
    // the argument being a growing array of numbers.

    series = series ? series : [];
    if (series.length < 2)
    { return [0, 1];
      // we must start with these two values
      // else the series can nbot grow.  
    }
    var newIndex      = series.length;
    var previousA     = series[newIndex-2];
    var previousB     = series[newIndex-1];
    var newValue      = previousA + previousB;
    series[newIndex]  = newValue;
    return series;
  }

   }

 
    }
    
 function testStrings ()
 {

  // 5. MAPPING OVER STRINGS
	// =======================
  // Previously we tested using RegExps as 
  // argument to fpmap() to split an input-string
  // into pieces and process each piece with
  // the function the map() is called upon.
  // Sometimes you may want more flexible logic
  // in how to process the string. What if you 
  // wanted the regexp to use to depend on 
  // what was matched previously? In such a 
  // case you can write your own loop replacing 
  // the RegExp on subsequent calls as needed. 
  //
  // fmap() can do that looping for you if you
  // call it with a String argument (rather than
  // a RegExp). Below examples show how to use it.
  // 
  // In general the benefit of fmap(String) over 
  // complicated RegExps is that you can spell out 
  // the processing logic in detail in "plain old 
  // JavaScript", which is easy to write, understand, 
  // annotate with comments to make it even easier
  // to understand what it does and WHY it does 
  // what it does, and can be run in a debugger.
    
      
  // 5.1 TITLE-CASING WORDS 
  // The first example no doubt could be done 
  // using only RegExps as well. But below is
  // a straightforward way to do it without 
  // much thinking required, once you know
  // how fpmap(<String>) works.
     
  var s = titleCased.map("hello world now");
  ok (s === "Hello World Now");
  
  // How fmap(<String>) does the above:
  //
  // 1. The string to process is initially passed
  //    into the processor-function (titleCased)
  //    in full as its first argument and an empty 
  //    string is passed as the 2nd.  
  //
  // 2. The processor-function then "consumes" PART 
  //    of its first argument transforms it into
  //    something else which it returns.
  //
  // 3. Internally fmap() gets the result and
  //    reads its length to know what is the 
  //    remaining part of the string that is not
  //    processed yet which it will ask the 
  //    processor-function to process on the
  //    next round as the 'toConsume' argument.
  //
  // 4. When the sum of the lengths of the 
  //    results from processor-function is
  //     equal or greated than the lenght of
  //     the original string-argument the 
  //     processing is over and the concatnated
  //     results from each call is reurned.
  //     
  // There's 2 more things to know, 1. How to produce 
  // an output that is of differen length than the 
  // input, and 2. How to produce a "parse tree" 
  // while processing the input-string. Those are
  // explained in later two examples.

  function titleCased (toConsume, consumed, fullInput)
  { if (! toConsume) return "";  
 
    var parts       = toConsume.split(/ /);
    var firstWord   = parts[0];
    var firstWordTC = firstWord[0].toUpperCase() 
                    + firstWord.slice(1);
    if (parts.length > 1)
    { firstWordTC += ' '; 
    }
    return  firstWordTC;   
  }
  

  // 5.2
  // This example which shows the output can also 
  // be of different length than the input.

  var s = doubleEveryChar.map("abcd") ;
  ok (s === "aabbccdd");
  
  // The processing-function doubleEveryChar()
  // below returns not a String but a {} which 
  // BEHAVES LIKE a string in that it has the 
  // property 'length', and like any object it 
  // can be converted to a String by calling 
  // its method toString(). This allows us to 
  // set the length of the result to 1 while 
  // its string-representation is actually 2 
  // characters.  
  //
  // The length of each partial result tells the 
  // fmap how much more of the input is 'consumed' 
  // by each call to this function so it knows
  // what to pass as the 'toConsume' argument
  // in the next and later calls. 
   
  // By returning an object whose length is 1 
  // the doubleEveryChar() is in effect telling 
  // its caller:
  // "I have now procssed the first character 
  // of the input you gave me most recently.
  // No need to give that to me again, but I
  // still want to process all the remaining 
  // characters after it."
     
  function doubleEveryChar (toConsume, consumed)
  { if (toConsume === "") return "";
 
    var char   = toConsume[0];
    var result = {};
    result.toString
    = function () {return char + char
                  };
    result.length = 1; // one more consumed
    return result;
  }
 
  // 5.3 PRODUCING A PARSE-TREE
  // fpmap(<String>) takes an optional 2nd argument 
  // 'thisArg' whose value will be the 'this' during
  // calls to the processor-function. So its purpose
  // and behavior is the same as for the standard
  // JavaScript function Array.prototype.map.
  // 
  // By passing in [] or {} as the 'thisArg' the
  // processing function can store arbitrary data
  // into its 'this' which will be available on
  // subsequent rounds. In effect this means that
  // the processor-function has a 'memory'. Note
  // that RegularExpressions do not have memory.
  // But fpmap(<String>, memory) does.  This allows
  // it to be used for things which can not be done
  // by RegularExpressions alone, such as parsing
  // HTML. The reason RegExps can not do that is 
  // that HTML tag-pairs can contain other tag-pairs
  // inside them recursively. SO if you search-for
  // a closing </div> for instance, you can't know
  // which opening tag the next closi8ng tag corresponds 
  // to.
   
  // The following is an example of a simple parser
  // which parses a subset of HTML containing only
  // <div> -tags. The purpose here is to show how
  // simple parsers can be simply implemented with 
  // the help of fpmap(<String>). It is only for
  // the purposes of demonstrating and unti-testing
  // the behavior of fpmap(<String>). There may be
  // errors in it, if there are will not fix them
  // as lonmg as all our ok()-assertions below pass.

  // As een from the code for parseDivs() below
  // this is not our simplest example. But it
  // is straightforward to understand in terms
  // of how fpmap(<String>, thisArg) works: 
  // Get the remaining input not yet parsed, 
  // detect a pattern it starts with, decide
  // what kind of syntactic element it represents
  // and store that information as the "state"
  // of the parsing process. Then continue until
  // all input has been consumed, or you discover
  // that the input is not a valid sentence in the
  // language you are parsing.
  //  
  // In the end the output is the same as the input
  // if the input iss valid, or undefined if it was not. 
  // The real result of the parsing will be in the 
  // structure added to  the 2nd arg 'thisArg' which 
  // is seen as the 'this' inside the parser-function   
  //
  // Parsers are not the simplest things, one reason
  // being that a parser must not only extract the
  // correct structure from valid input, they must
  // also correctly recognize all invalid inputs
  // as inputs. 

  var parseStack  = []; 
  var sInput  
  = " <!DOCTYPE html> <div> A B <div>A2 B2</div> C D </div>";
  var sOutput =  parseDivs.map (sInput, parseStack);
  
   ok (sInput.trim() === sOutput); 
   // means parse succeeded. 
   var parseResult   = parseStack[0];

 // THE PARSE-RESULTS:   
  ok(parseResult[0]  			  === "<!DOCTYPE html>");
  ok(parseResult[1][0] 			=== "<div>");
  ok(parseResult[1][1] 			=== "A B");
  ok(parseResult[1][2][0] 	=== "<div>");
  ok(parseResult[1][2][1] 	=== "A2 B2");
  ok(parseResult[1][2][2] 	=== "</div>");
  ok(parseResult[1][3] 			=== "C D");
  ok(parseResult[1][4] 			=== "</div>");
  ok(parseResult[1].length  === 5);
 

   // Failing cases. The processor function tells us
   // it does not accept the input by returning undefined,
   // which then immediately aborts the parse, and is
   // returned as the final output.
   var sInput  
   = "<!DOCTYPE html> <div> A B <div>A2 B2</div> C D </div> BAD ";
   ok( parseDivs.map (sInput, parseStack) === undefined);
   // the ending 'BAD' fails it because our grammar does not
   // allow it
   
   var sInput  
   = "zzz <!DOCTYPE html> <div> A B <div>A2 B2</div> C D </div>";
   ok(undefined === parseDivs.map (sInput, parseStack));
   // the zzz at the beginning is not kosher.

   ok (parseDivs.map ("<div>", [])     === undefined);
   ok (parseDivs.map ("<div> a", [])   === undefined);
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
    
    var mOpenTag    = toConsume.match(/^\s*?<div>/);
    var mCloseTag   = toConsume.match(/^\s*?<\/div>/);
    var mUptilTag   = toConsume.match(/^(.*?)</) ; 
    // mUptilTag needs a "capturing group" so we 
    // get the content up till but not including
    // the next '<'.
    
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
    {  stack.push ( [mOpenTag[0].trim() ]);
      // A new open stack means we must open a new
      // level on the stack, to which we add this
      // opening tag now and other elements on subsequent
      // rounds.
      return mOpenTag[0];
    }

    if (mCloseTag)
    { if (! stackTopArray)
      {// Means there was a closing tag with
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

      stackTopArray.push(mCloseTag[0].trim() );
      var closedTopArray = stackTopArray;
    
      stack.pop(); // closing tag means this element is ready
      stackTopArray = stack [stack.length-1]; 
      if (! stackTopArray)
      { debugger    // should not come here
        return   mCloseTag[0];
      }
      // Move the now closed stack-top array to be
      // the latest element in the new stack to.
      // It is an array meaning it has its own elements,
      // which are either strings or arrays (of deeper-level
      // elements). The parse might now be complete
      // but will know if it is if my caller next
      // calls here with empty toConsume -string.

      stackTopArray.push(closedTopArray);
      return   mCloseTag[0];
    }
     
   if (mUptilTag)
    { if (mUptilTag [1] === "")
      { // there is <something> which is not the <div nor </div
        // because those were caught already above.   .
        // Our simple grammar will treat any other tags than 
        // div just like any non-tagged text. The uptiltag was 
         // produced with:
        // var mUptilTag   = toConsume.match(/^(.*?)</) ;
        // so adjust it till the past the closing >
        mUptilTag   = toConsume.match(/^(.*?<.*?\>)/) ;
 
      } else 
     { if (stack.length < 2)
     { // there is non-non-whitespace before
       // the first < which we dont allow.
       // Return undefined to indicate the
       // parse must fail.
       return undefined;
      }
     }

     stackTopArray.push(mUptilTag [1].trim() );
      return   mUptilTag [1]; 
     //mUptilTag [1] is the part BEFORE '<'
    }
     /*  It is a string which ends the input
         without any < after it. That is the case
         if input has no tags in it. Or maybe
         it just ends in non-tags.
      */
    
    if (stack.length < 2)
    { if (toConsume.trim() !== "")
      { // There is no < found any more.
        // But  there is something else than whitespace
        // We dont allow that so the parse must fail.
      return undefined;
      }
      return toConsume;
    }
 
    return undefined;
 }


  // 5.4
  // One more non-trivial test and example.
  // This one counts how many 'X' occur in 
  // the input and writes that number to the 
  // end of the output.  
  //
  // What this example shows is that fpmap(<String>) 
  // is not a replacement regular-exporessions but 
  // works well in combination with them.
   
  
  var s = countXs.map("XAbXXcdX") ;
  ok (s === "Abcd4"); // there was 4 X -chars
  var s = countXs.map("Abcd") ;
  ok (s === "Abcd0"); // there was 0 X -chars.

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
  } // end countXs();

 }  
 
} // end runTests()


//  SOME FUNCTIONS WE"RE TESTING WITH:
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

 
// ASSERTION UTILITY ok():
function ok (bool, msg)
{ msg = msg ? msg : "ok() failed";
  if(! bool)
  {  throw msg;
    // putting a breakpoint here helps 
    // speed up development in the Node.js
    // context.
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

