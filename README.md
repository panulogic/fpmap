# fpmap
Support for Functional Programming in JavaScript via the extension-method **Function.prototype.map()**.

Following excerpts show some ways of using "fpmap". These samples use functions such as ```double()``` whose definition is shown in Section 9. below.

For more explanation and examples read the tests-file fpmap_test.js.


#### 1. INSTALLATION
    var fpm        =  require("fpmap");
    fpm ();        // Installs 'map()' as a method of functions.
    ok (it.map);   // Now every function has method map().
    fpm ('map9');  // Installs it under different name
    ok (it.map9);  // Now every function has method map9().

If some other function is already installed under the same property-name you are trying to use, you will get an error. This makes sure you will not accidentally overwrite an existing but different version. You can then just use a different name for it.






#### 2. MAPPING OVER ARRAYS

###### 2.1  Arrays Transforming
	var doubled    = double.map([1,2,3]);
	ok(doubled[0] === 2);
	ok(doubled[1] === 4);
	ok(doubled[2] === 6);

###### 2.2  Arrays Filtering
	var odds    = odd.map([1,2,3]);
	ok(odds[0] === 1);
	ok(odds[1] === 3);
	ok(odds.length === 2);

#### 3. MAPPING OVER OBJECTS

###### 3.1  Objects Transforming
    var doubleO  = double.map ({x:1, y:2});
    ok(doubleO.x === 2);
    ok (doubleO.y === 4);

###### 3.2  Objects Filtering
    var oddOnly  = odd.map({x:1, y:2});
    ok (oddOnly.x === 1);
    ok (oddOnly.y === undefined);


#### 4. MAPPING OVER FUNCTIONS

###### 4.1 Functions Transforming

     var asIs = it.map(it);    // it()  returns its argument
     ok (asIs (34) === 34);

     var times2 = it.map(double);
     ok (times2(2) === 4);

     var times8 = double.map(double).map(double);
     ok (times8	(1) === 8);


###### 4.2 Functions Filtering

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

    testRegExp        ();
    testNumbers       ();
    testStrings       ();


#### 5. MAPPING OVER RegExps
Calling aFunction.map(...) with a RegExp as argument returns a function which when called with a String will return as array all the matches of the reg-exp from the string given as argument, also allowing you to programmatically come up with a replacement to be used for each match.

See fmap_test.js for examples such as how to  programmatically determine the replacements to be made to an input-string, apply them all, and in the end get an array for all the replacements made, which can be Objects rather than just Strings.

Here's a small example:

    var dogString  
    = "<dog> name: Fido</dog> <dog>name:Fifi </dog>";
    var dogPattern
    = /\<dog\>(\s*name:\s*)(.*?)\s*\<\/dog\>/ ;

    var dogParse   = createDog.map (dogPattern);
    var dogs       = dogParse (dogString)
                     . map(x => x.\_replacement);

    ok (dogs[0].name() === "Fido");
    ok (dogs[1].name() === "Fifi");    


#### 6. MAPPING OVER Numbers
Calling aFunction.map() with a Number -argument returns a function which will call 'aFunction' with its argument, then use the result as the next argument to call aFunction with and so on, repeating that n times, where n is the argument that was given to aFunction.map() originally.

See fmap_test.js for examples such as how to use this to produce number series such as the Fibonacci series with a memoizing implementation.

Here's the Simplest Example of Mapping Over Numbers:

    function oneToN (anArray)
    { anArray.push (arr.length + 1);
      return anArray;
	}

    var oneTo100 =  oneToN.map(100) ();
    ok (oneTo100.length === 100);
    ok (oneTo100[0]     === 1);
    ok (oneTo100[1]     === 2);
    ok (oneTo100[99]    === 100);


#### 7. MAPPING OVER Strings
Calling aFunction.map(...) with a String argument in effect allows you "write your own RegExp -engine". While calling fpmap() with a RegExp uses the same single reg-exp to split a string into parts, calling it with a String allows you to dynamically decide the logic in which the split is done, recursively.

See fmap_test.js for an example of how to implement a simple parser parsing a small subset of HTML. You can use it as a starting point for your own more advanced parsers. Here's how it looks:

    var parseStack  = [];
    var sInput  
    = " <!DOCTYPE html> <div> A B <div>A2 B2</div> C D </div>";
    var sOutput =  parseDivs.map (sInput, parseStack);

    ok (sInput.trim() === sOutput); // means parse succeeded.
    var parseResult   = parseStack[0];

    // PARSE-RESULTS:   
    ok(parseResult[0]       === "<!DOCTYPE html>");
    ok(parseResult[1][0]    === "<div>");
    ok(parseResult[1][1]    === "A B");
    ok(parseResult[1][2][0] === "<div>");
    ok(parseResult[1][2][1] === "A2 B2");
    ok(parseResult[1][2][2] === "</div>");
    ok(parseResult[1][3]    === "C D");
    ok(parseResult[1][4]    === "</div>");
    ok(parseResult[1][5]    === undefined);



#### 8. AVOIDING NAME-CONFLIFTS

Note that loading/requiring fpmap.js adds NOTHING to Function.prototype. You must do that yourself by calling the function returned by require("fpmap"). This is on purpose so you are aware you are adding a new method to Function.prototype. It does not happen "behind the scenes". When installing it you can choose the name you want to install it as.

If some other function is already installed under the same name you will get an error. This makes sure you will not accidentally overwrite an existing but different version. You can then just install it under a different name, or you can remove the previous version if you prefer.  

We can not promise that code written by someone else will not overwrite our implementation without warning you, or can we?
YES WE CAN because we use Object.defineProperty() to install the method Function.prototype.map() as a READ-ONLY property. That might not works in all browsers however. Note it also seems there is no error if you try to overwrite such a read-only -property, he assignment just has no effect.   

Our tests-file fpmap_test.js installs "fpmap" with the default method-name 'map()',  to emphasize its similarity with Array.prototype.map().  


#### 9. SOME FUNCTIONS USED in examples

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
