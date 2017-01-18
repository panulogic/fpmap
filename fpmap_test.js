/* =======================================
  Copyright 2017 Panu Viljamaa   
  SPDX-License-Identifier: Apache-2.0
  ------------------------------------
  FILE: fpmap/fpmap_test.js
  Define and run the Tests for fpmap.js .
  ========================================
 */
 
var fpm = require("./fpmap");
runTests(fpm);
return;

function runTests (fpm)
{

  // 1. INSTALLATION

  // 1.1 Install the method Function.prototype.map
	// assuming it has not been installed already.
  // After this every function has the method map().

	fpm (); 
  ok (it.map); // 'it' could be any function
    
  // 1.2  
  // There's no error trying to install it
  // many times as long as the exact same
  // function gets stored as Function.prototype.map.
  // But see section 6 below for how to cause an error.
  fpm ();
  fpm ();
  ok (it.map);
 

  // 2. MAPPING OVER ARRAYS
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
  
  // 3.1 TRANSFORMING
  var doubleO  = double.map({x:1, y:2});
	ok(doubleO.x === 2);
	ok(doubleO.y === 4);
 
  // 3.1 FILTERING
  var oddOnly  = odd.map({x:1, y:2});
	ok(oddOnly.x === 1);
	ok(oddOnly.y === undefined);
 
 
  // 4. MAPPING OVER FUNCTIONS

  // 4.1 TRANSFORMING
  var asIs = it.map(it); // it just returns its argument
	ok (asIs (34) === 34);
	
  var times2 = it.map(double);
	ok (times2(2) === 4);

	var times8 = double.map(double).map(double);
	ok (times8	(1) === 8);


  // 4.2 FILTERING
  // Filters are functions which may return
  // undefined, such results are dropped
  // from the pipeline ASAP in effect
  // allowing us to keep just the results
  // we want, to pass on.

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
  // something it can not be odd any more:
  ok (doublesWhichAreOdd(-1) === undefined);
  ok (doublesWhichAreOdd(0 ) === undefined);
  ok (doublesWhichAreOdd(1 ) === undefined);
  ok (doublesWhichAreOdd(2 ) === undefined);
  ok (doublesWhichAreOdd(3 ) === undefined);


  // 5. RUNNING UNDER AN ALIAS 

  // Do the same tests as above but by using
	// metod-name  'map9' as the name as which
	// it is installed. Note: it will be exist
	// as both because of these tests.
	fpm  ('map9') ;
	
	var asIs			= it.map9 (it);
	var times2		= it.map9 (double);
	var times8    = double.map9(double).map9(double);
 
	ok (asIs		(34) === 34);
	ok (times2	(2 ) === 4);
	ok (times8	(1 ) === 8);
  
  // Cleanup:
  Function.prototype.map9 = undefined;
 

  // 6. AVOIDING NAME CONFLICTS
  // You can also install it under a different name
  
  ok (! it.map7); // does not exist so far
  fpm ('map7');
  ok (it.map7);   // now it does.
  fpm ('map7');   // Installs the same thing again
  ok (it.map7);
  
  // Assume someone else has earlier installed
  //  their version with something like: 
  Function.prototype.map7 = it;
  
  // Trying to  overwrite and existing version
  // that is not our version  causes an error:
  var e2 = false;
  try
  { fpm ('map7');
  } catch (e)
  { e2 = e;
  }
  ok(e2.constructor === Error);

  Function.prototype.map7 = undefined;
  // Now it is available again:
  fpm ('map7');
  // Cleanup: 
  Function.prototype.map7 = undefined;

  // -----------------------------------------
  console.log ("FPM_test.js: ALL TESTS PASSED "
              , (new Date()) .getTime()
              );
	return;
}


// ------------------------------------------
// 6. FUNCTIONS TO TEST WITH:

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

 
function ok (bool, msg)
{ msg = msg ? msg : "ok() failed";
  if(! bool)
  { throw msg;
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

