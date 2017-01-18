# fpmap
Support for Functional Programming in JavaScript via the extension-method **Function.prototype.map()**.

Following excerpts show some ways of using "fpmap". These samples use a small set of functions like ```double()``` defined in _Section 5_ below. For more explanation and examples see  fpmap_test.js.


#### 1. INSTALLATION
    var fpm        =  require("fpmap");

    fpm ();        // Installs 'map()' as a method of functions.
    ok (it.map);   // Now every function has the method map().
    fpm ('map7');  // Installs it under different name
    ok (it.map7);  // Now every function has the method map7().


#### 2. MAPPING OVER ARRAYS

###### 2.1  Transforming
	var doubled    = double.map([1,2,3]);
	ok(doubled[0] === 2);
	ok(doubled[1] === 4);
	ok(doubled[2] === 6);

###### 2.2  Filtering
	var odds    = odd.map([1,2,3]);
	ok(odds[0] === 1);
	ok(odds[1] === 3);
	ok(odds.length === 2);

#### 3. MAPPING OVER OBJECTS

###### 3.1  Transforming
    var doubleO  = double.map ({x:1, y:2});
    ok(doubleO.x === 2);
    ok (doubleO.y === 4);

###### 3.2  Filtering
    var oddOnly  = odd.map({x:1, y:2});
    ok (oddOnly.x === 1);
    ok (oddOnly.y === undefined);

#### 4. MAPPING OVER FUNCTIONS

###### 4.1 TRANSFORMING

     var asIs = it.map(it);    // it()  returns its argument
     ok (asIs (34) === 34);

     var times2 = it.map(double);
     ok (times2(2) === 4);

     var times8 = double.map(double).map(double);
     ok (times8	(1) === 8);


###### 4.2 FILTERING

    var doubleOdds = odd.map(double);
    ok (doubleOdds(0) === undefined);
    ok (doubleOdds(1) === 2);
    ok (doubleOdds(2) === undefined);
    ok (doubleOdds(3) === 6);

    var dods       = doubleOdds.map([1,2,3]);
    ok (dods[0]     === 2);
    ok (dods[1]     === 6); // skipped '2'
    ok (dods.length === 2);

    doublesWhichAreOdd = double.map(odd);
    ok (doublesWhichAreOdd(-1) === undefined);
    ok (doublesWhichAreOdd(0 ) === undefined);
    ok (doublesWhichAreOdd(1 ) === undefined);
    ok (doublesWhichAreOdd(2 ) === undefined);
    ok (doublesWhichAreOdd(3 ) === undefined);


#### 5. TEST FUNCTIONS:

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
