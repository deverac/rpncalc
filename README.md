### RPNCalc

RPNCalc is a RPN calculator for Android; it can also run in any web browser.

The colors and layout are similar to HP48G.

There is no limit to the stack size.

The calculator state (stack and stored value) is not saved when the app is closed.

The APK is signed with an auto-generated certificate that is valid for 50 years.

Try it [online](https://deverac.github.io/rpncalc/).

#### FUNCTIONS

    +       Addition
    -       Subtraction
    *       Multiply
    /       Divide
    Pi      3.141592653 constant
    Tau     6.283185307 constant (2 * Pi)
    +/-     Change sign
    EEX     Exponent
    <=      Delete character
    SIN     Sine
    COS     Cosine
    TAN     Tangent
    1/x     Reciprocal
    y^x     Raise y to the power x
    STO     Store a value. Recall with RCL.
    DISP    Change display precision between ALL, SCI, FIX
              ALL:  Shows all digits
              FIX:  Show digits with fixed number of decimals. 
              SCI:  Show values in scientific format
    BASE    Change base between binary, octal, decimal, hexadecimal
    √x      Square root
    SWAP    Swap the two most recently entered values on the stack
    RAND    Random value
    C(y,x)  Combination (e.g. 6 choose 3 == 20)
    ASIN    Arcsine
    ACOS    Arccosine
    ATAN    Arctangent
    e^x     Exponential function (base-e)
    10^x    Exponential function (base-10)
    RCL     Recall the saved value (with STO) to the stack
    MODE    Change between DEG and RAD
              DEG  Degrees
              RAD  Radians
    x√y     n-th root (e.g. 8 root 3 == 2)
    MOD     Modular (e.g. 7 mod 3 == 1)
    x!      Factorial (e.g. 5! == 120)
    CLEAR   Clear all values in stack and the stored value
    LN      Natural logarithm
    LOG     Base10 logarithm
    AND     Bitwise AND 
    NOT     Bitwise NOT
    OR      Bitwise OR
    XOR     Bitwise XOR
    UNDO    Undo previous operation

When the Base is BIN, OCT, or HEX, the calculator functions (e.g. sqrt) will
operate on the entire value, but only the integer portion of the result will
be displayed. To see the entire value, change the Base to DEC.

Any integer can be displayed in binary, however, the Bitwise operators
(AND, NOT, OR, XOR) only operate on 32-bit values. If a Bitwise operation is
applied to a number larger than 32 bits, all high-order bits that exceed
32-bits will be discarded. The sign-bit is included in the 32-bit limit, so
the largest positive value that Bitwise operators can safely operate on is
2^31-1 == 2,147,483,647.

When displaying a negative integer in Binary, a string of eight 1's will
precede the binary representation of the number.

Binary values can be very long. The screen can be scrolled left and right to
view the entire number.

To change the number of decimals that are displayed, ensure FIX is selected,
then type an integer (but do not press the Enter key) and then press DISP.

To get a random value between 1 and 0, ensure a number is not currently being
entered and then press RAND. To get a random integer value between 1 and N,
enter the integer N (but do not press the Enter key), and then press RAND.

The largest integer that can be stored exactly is
2^53-1 == 9,007,199,254,740,991. Larger values can be entered, but their actual
value will be rounded to a value that can be stored.

Although RPNCalc is intended to be used as an Android app, `rpncalc.html` will
work in any browser. `rpncalc.html` is a single-page app and has no
dependencies. (There is a large variation in the size of text that browsers
use to display superscript items so, unfortunately, the 'shifted' function
names on the keys may appear small.)

Either the calculator's button's or the keyboard may be used to control
the calculator.

#### KEYBOARD

    KEY      BUTTON

    Enter    Enter
    Bkspc    <=
    Escape   C (clear)
    0        0
    1        1
    2        2
    3        3
    4        4
    5        5
    6        6
    7        7
    8        8
    9        9
    A        Hex A
    B        Hex B
    C        Hex C
    D        Hex D
    E        Hex E
    F        Hex F
    .        . (decimal point)
    -        Subtract
    +        Add
    *        Multiply
    /        Divide
    b        BASE
    c        COS
    d        DISP
    e        EEX
    o        STO
    p        +/- (plus/minus)
    q        √x (sqrt)
    r        1/x
    s        SIN
    t        TAN
    w        SWAP
    y        y^x
    [        LeftShift
    ]        RightShift
