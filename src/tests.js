// This is a very simple test framework.
// This file gets injected into rpmcalc.html and is automatically run.
// FIXME Add more tests for number validation, radian calculations, error conditions.
// This only tests functionality; it does not test hiding numbers when base changes.
// For keyboard, only keys are tested, not every function.

let TEST_RESULTS = []
let TEST_COUNTER = 0
let CURRENT_TEST = ''

// Test harness functions.
function it(name, fn) {
    TEST_COUNTER++
    CURRENT_TEST = TEST_COUNTER+'. '+name
    TEST_RESULTS.push(CURRENT_TEST)
    console.log(CURRENT_TEST)
    resetCalc()
    fn()
}

function show_test_results(txt) {
    _stopBlinking()
    console.log(txt)
    setTimeout(() => {
        const lcdEle = gId('lcd')
        lcdEle.value = txt
        lcdEle.scrollTop = lcdEle.scrollHeight
    }, BLINK_DELAY_MS * 2) // '*2' ensures blinking has stopped.
}

function all_tests_passed() {
    show_test_results('\nAll '+TEST_COUNTER+' tests have passed.')
}

function fail(errmsg) {
    show_test_results([CURRENT_TEST, errmsg, 'Test failed'].join('\n'))
    throw new Error(errmsg)
}

function expect(val) {
  return {
      toEqual: (exp) => { if (val.toString() != exp.toString()) { fail('Actual: '+val+'\nExpected: '+exp) }},
      toBeTruthy: () => { if (!val) { fail('Expected '+val+' to be truthy.') }},
      toBeFalsy: () => { if (val) { fail('Expected '+val+' to be falsy.') }},
  }
}


// Helper functions
function gId(id) {
  return document.getElementById(id)
}
function getLcd() {
  return gId('lcd').value
}
function getLeftShiftInd() {
  return gId('lsind').innerHTML
}
function getRightShiftInd() {
  return gId('rsind').innerHTML
}
function getBaseInd() {
  return gId('baseind').innerText
}
function getPrecisionInd() {
  return gId('precind').innerText
}
function getModeInd() {
  return gId('modeind').innerText
}
function getStoreInd() {
  return gId('stoind').innerText
}

function resetCalc() {
  _resetCalc()
  _updateLcd()
}

function getBlinkOnChar() {
  return '\u25fb'
}

function getBlinkOffChar() {
  return '\u25fc'
}

function getLeftShiftIndChar() {
  return '\u21b0'
}

function getRightShiftIndChar() {
  return '\u21b1'
}

function toLcd(val) {
  let lines = []
  if (Array.isArray(val)) {
      lines = val
  } else {
      lines.push(val)
  }
  while (lines.length < 5) {
      lines.unshift('')
  }
  return lines.join('\n')
}

function isBlinking() {
  let lcd = getLcd()
  const lastChr = lcd.substring(lcd.length-1)
  return (lastChr == getBlinkOnChar() || lastChr == getBlinkOffChar())
}

function getNonBlinkingText() {
  let lcd = getLcd()
  return lcd.substring(0, lcd.length-1)
}

// Stack with pending entry
function expectPending(val) {
  expect(isBlinking()).toBeTruthy()
  expect(getNonBlinkingText()).toEqual(toLcd(val))
}

// Stack with no entry pending
function expectStack(val) {
    expect(isBlinking()).toBeFalsy()
    expect(getLcd()).toEqual(toLcd(val))
}

function btnRcl() { btnLeftShift();  btnSto() }
function btnMode() { btnLeftShift();  btnBase() }
function btnRootxy() { btnLeftShift();  btnSqrt() }
function btnAsin() { btnLeftShift();  btnSin() }
function btnAcos() { btnLeftShift();  btnCos() }
function btnAtan() { btnLeftShift();  btnTan() }
function btnPowex() { btnLeftShift();  btnRecip() }
function btnPow10x() { btnLeftShift();  btnPowyx() }
function btnRand() { btnLeftShift();  btnChangeSign() }
function btnCombo() { btnLeftShift();  btnExpo() }

function btnAnd() { btnRightShift(); btnSto() }
function btnNot() { btnRightShift(); btnDisp() }
function btnOr() { btnRightShift(); btnBase() }
function btnXor() { btnRightShift(); btnSqrt() }
function btnUndo() { btnRightShift(); btnSwap() }
function btnLn() { btnRightShift(); btnRecip() }
function btnLog() { btnRightShift(); btnPowyx() }
function btnMod() { btnRightShift(); btnChangeSign() }
function btnFact() { btnRightShift(); btnExpo() }
function btnClear() { btnRightShift(); btnDeleteChar() }

function btnHexA() { btnRightShift(); btn0() }
function btnHexB() { btnRightShift(); btn1() }
function btnHexC() { btnRightShift(); btn2() }
function btnHexD() { btnRightShift(); btn3() }
function btnHexE() { btnRightShift(); btn4() }
function btnHexF() { btnRightShift(); btn5() }


function btnTau() { btnLeftShift(); btnDot() }
function btnPi() { btnRightShift(); btnDot() }

// Tests
it('leftshift: should toggle indicator', () => {
  expect(getLeftShiftInd()).toEqual('')
  btnLeftShift()
  expect(getLeftShiftInd()).toEqual(getLeftShiftIndChar())
  btnLeftShift()
  expect(getLeftShiftInd()).toEqual('')
})

it('leftshift: should cancel right shift', () => {
  expect(getRightShiftInd()).toEqual('')
  btnRightShift()
  expect(getRightShiftInd()).toEqual(getRightShiftIndChar())
  btnLeftShift()
  expect(getRightShiftInd()).toEqual('')
})

it('rightshift: should toggle indicator', () => {
  expect(getRightShiftInd()).toEqual('')
  btnRightShift()
  expect(getRightShiftInd()).toEqual(getRightShiftIndChar())
  btnRightShift()
  expect(getRightShiftInd()).toEqual('')
})

it('rightshift: should cancel left shift', () => {
  expect(getLeftShiftInd()).toEqual('')
  btnLeftShift()
  expect(getLeftShiftInd()).toEqual(getLeftShiftIndChar())
  btnRightShift()
  expect(getLeftShiftInd()).toEqual('')
})





it('0: should show', () => {
  btn0()
  expectPending(0)
  btnEnter()
  expectStack(0)
})

it('leftshift_0: should do nothing', () => {
  btnLeftShift()
  btn0()
  expectStack('')
})

it('rightshift_0: should do nothing', () => {
  btnRightShift()
  btn0()
  expectStack('')
})

it('1: should show', () => {
  btn1()
  expectPending(1)
  btnEnter()
  expectStack(1)
})

it('leftshift_1: should do nothing', () => {
  btnLeftShift()
  btn1()
  expectStack('')
})

it('rightshift_1: should do nothing', () => {
  btnRightShift()
  btn1()
  expectStack('')
})



it('2: should show', () => {
  btn2()
  expectPending(2)
  btnEnter()
  expectStack(2)
})

it('leftshift_2: should do nothing', () => {
  btnLeftShift()
  btn2()
  expectStack('')
})

it('rightshift_2: should do nothing', () => {
  btnRightShift()
  btn2()
  expectStack('')
})



it('should 3', () => {
  btn3()
  expectPending(3)
  btnEnter()
  expectStack(3)
})

it('leftshift_3: should do nothing', () => {
  btnLeftShift()
  btn3()
  expectStack('')
})

it('rightshift_3: should do nothing', () => {
  btnRightShift()
  btn3()
  expectStack('')
})



it('should 4', () => {
  btn4()
  expectPending(4)
  btnEnter()
  expectStack(4)
})

it('leftshift_4: should do nothing', () => {
  btnLeftShift()
  btn4()
  expectStack('')
})

it('rightshift_4: should do nothing', () => {
  btnRightShift()
  btn4()
  expectStack('')
})


it('5: should show', () => {
  btn5()
  expectPending(5)
  btnEnter()
  expectStack(5)
})

it('leftshift_5: should do nothing', () => {
  btnLeftShift()
  btn5()
  expectStack('')
})

it('rightshift_5: should do nothing', () => {
  btnRightShift()
  btn5()
  expectStack('')
})


it('6: should show', () => {
  btn6()
  expectPending(6)
  btnEnter()
  expectStack(6)
})

it('leftshift_6: should do nothing', () => {
  btnLeftShift()
  btn6()
  expectStack('')
})

it('rightshift_6: should do nothing', () => {
  btnRightShift()
  btn6()
  expectStack('')
})


it('7: should show', () => {
  btn7()
  expectPending(7)
  btnEnter()
  expectStack(7)
})

it('leftshift_7: should do nothing', () => {
  btnLeftShift()
  btn7()
  expectStack('')
})

it('rightshift_7: should do nothing', () => {
  btnRightShift()
  btn7()
  expectStack('')
})


it('should 8', () => {
  btn8()
  expectPending(8)
  btnEnter()
  expectStack(8)
})

it('leftshift_8: should do nothing', () => {
  btnLeftShift()
  btn8()
  expectStack('')
})

it('rightshift_8: should do nothing', () => {
  btnRightShift()
  btn8()
  expectStack('')
})


it('should 9', () => {
  btn9()
  expectPending(9)
  btnEnter()
  expectStack(9)
})

it('leftshift_9: should do nothing', () => {
  btnLeftShift()
  btn9()
  expectStack('')
})

it('rightshift_9: should do nothing', () => {
  btnRightShift()
  btn9()
  expectStack('')
})


it('dot: should show', () => {
  btn1()
  btnDot()
  btn3()
  btnEnter()
  expectStack('1.3')
})

it('leftshift_dot: should show tau', () => {
  btnTau()
  expect(getLcd().startsWith('\n\n\n\n6.2831853')).toBeTruthy()
})

it('rightshift_dot: should show pi', () => {
  btnPi()
  expect(getLcd().startsWith('\n\n\n\n3.14159265')).toBeTruthy()
})

it('clear: should remove pending entry', () => {
  btn3()
  btnEnter()
  btn4()
  btnEnter()
  btn5()
  expectPending([3,4,5])
  btnC()
  expectStack([3,4])
})

it('leftshift_clear: should remove pending entry', () => {
  btn3()
  btnEnter()
  btn4()
  btnEnter()
  btn5()
  expectPending([3,4,5])
  btnLeftShift()
  btnC()
  expectStack([3,4])
})

it('rightshift_clear: should remove pending entry', () => {
  btn3()
  btnEnter()
  btn4()
  btnEnter()
  btn5()
  expectPending([3,4,5])
  btnRightShift()
  btnC()
  expectStack([3,4])
})

it('clear: should not remove stack', () => {
  btn3()
  btnEnter()
  btn4()
  btnEnter()
  btn5()
  btnEnter()

  btnC()
  expectStack([3,4,5])
})


it('leftshift_clear: should not remove stack', () => {
  btn3()
  btnEnter()
  btn4()
  btnEnter()
  btn5()
  btnEnter()
  btnLeftShift()
  btnC()
  //expect(getLcd()).toEqual(toLcd([3,4,5]))
  expectStack([3,4,5])
})

it('rightshift_clear: should not remove stack', () => {
  btn3()
  btnEnter()
  btn4()
  btnEnter()
  btn5()
  btnEnter()
  btnRightShift()
  btnC()
  expectStack([3,4,5])
})


it('add: should add pending', () => {
  btn1()
  btnEnter()
  btn3()
  btnAdd()
  expectStack(4)
})

it('add: should add stack', () => {
  btn1()
  btnEnter()
  btn3()
  btnEnter()
  btnAdd()
  expectStack(4)
})


it('leftshift_add: should do nothing to pending', () => {
  btn1()
  btnEnter()
  btn3()
  expectPending([1,3])
  btnLeftShift()
  btnAdd()
  expectPending([1,3])
})

it('leftshift_add: should do nothing to stack', () => {
  btn1()
  btnEnter()
  btn3()
  btnEnter()
  btnLeftShift()
  btnAdd()
  expectStack([1, 3])
})


it('rightshift_add: should do nothing to pending', () => {
  btn1()
  btnEnter()
  btn3()
  expectPending([1,3])
  btnRightShift()
  btnAdd()
  expectPending([1,3])
})

it('rightshift_add: should do nothing to stack', () => {
  btn1()
  btnEnter()
  btn3()
  btnEnter()
  btnRightShift()
  btnAdd()
  expectStack([1,3])
})


it('subtract: should subtract pending', () => {
  btn3()
  btnEnter()
  btn1()
  btnSubtract()
  expectStack(2)
})

it('subtract: should subtract stack', () => {
  btn3()
  btnEnter()
  btn1()
  btnEnter()
  btnSubtract()
  expectStack(2)
})


it('leftshift_subtract: should do nothing to pending', () => {
  btn3()
  btnEnter()
  btn1()
  expectPending([3,1])
  btnLeftShift()
  btnSubtract()
  expectPending([3,1])
})

it('leftshift_subtract: should do nothing to stack', () => {
  btn3()
  btnEnter()
  btn1()
  btnEnter()
  expectStack([3,1])
  btnLeftShift()
  btnSubtract()
  expectStack([3,1])
})

it('rightshift_subtract: should do nothing to pending', () => {
  btn3()
  btnEnter()
  btn1()
  expectPending([3,1])
  btnRightShift()
  btnSubtract()
  expectPending([3,1])
})

it('rightshift_subtract: should do nothing to stack', () => {
  btn3()
  btnEnter()
  btn1()
  btnEnter()
  btnRightShift()
  btnSubtract()
  expectStack([3, 1])
})




it('multiply: should multiply pending', () => {
  btn3()
  btnEnter()
  btn2()
  expectPending([3,2])
  btnMultiply()
  expectStack(6)
})

it('multiply: should multiply stack', () => {
  btn3()
  btnEnter()
  btn2()
  btnEnter()
  expectStack([3,2])
  btnMultiply()
  expectStack(6)
})


it('leftshift_multiply: should do nothing to pending', () => {
  btn3()
  btnEnter()
  btn2()
  expectPending([3,2])
  btnLeftShift()
  btnMultiply()
  expectPending([3,2])
})

it('leftshift_multiply: should do nothing to stack', () => {
  btn3()
  btnEnter()
  btn2()
  btnEnter()
  expectStack([3,2])
  btnLeftShift()
  btnMultiply()
  expectStack([3,2])
})

it('rightshift_multiply: should do nothing to pending', () => {
  btn3()
  btnEnter()
  btn2()
  expectPending([3,2])
  btnRightShift()
  btnMultiply()
  expectPending([3,2])
})

it('rightshift_multiply: should do nothing to stack', () => {
  btn3()
  btnEnter()
  btn2()
  btnEnter()
  expectStack([3,2])
  btnRightShift()
  btnMultiply()
  expectStack([3,2])
})



it('divide: should divide pending', () => {
  btn6()
  btnEnter()
  btn2()
  expectPending([6,2])
  btnDivide()
  expectStack(3)
})

it('divide: should divide stack', () => {
  btn6()
  btnEnter()
  btn2()
  btnEnter()
  expectStack([6,2])
  btnDivide()
  expectStack(3)
})


it('leftshift_divide: should do nothing to pending', () => {
  btn6()
  btnEnter()
  btn2()
  expectPending([6,2])
  btnLeftShift()
  btnDivide()
  expectPending([6,2])
})

it('leftshift_divide: should do nothing to stack', () => {
  btn6()
  btnEnter()
  btn2()
  btnEnter()
  expectStack([6,2])
  btnLeftShift()
  btnDivide()
  expectStack([6,2])
})

it('rightshift_divide: should do nothing to pending', () => {
  btn6()
  btnEnter()
  btn2()
  expectPending([6,2])
  btnRightShift()
  btnDivide()
  expectPending([6,2])
})

it('rightshift_divide: should do nothing to stack', () => {
  btn6()
  btnEnter()
  btn2()
  btnEnter()
  btnRightShift()
  btnDivide()
  expect(getLcd()).toEqual(toLcd([6, 2]))
})


it('enter: should accept pending', () => {
  btn6()
  expectPending(6)
  btnEnter()
  expectStack(6)
})

it('enter: should duplicate bottom stack value', () => {
  btn6()
  btnEnter()
  expectStack(6)
  btnEnter()
  expectStack([6,6])
})

it('leftshift_enter: should do nothing to pending', () => {
  btn6()
  expectPending(6)
  btnLeftShift()
  btnEnter()
  expectPending(6)
})

it('leftshift_enter: should do nothing to stack', () => {
  btn6()
  btnEnter()
  expectStack(6)
  btnLeftShift()
  btnEnter()
  expectStack(6)
})

it('rightshift_enter: should do nothing to pending', () => {
  btn6()
  expectPending(6)
  btnRightShift()
  btnEnter()
  expectPending(6)
})

it('rightshift_enter: should do nothing to stack', () => {
  btn6()
  btnEnter()
  expectStack(6)
  btnRightShift()
  btnEnter()
  expectStack(6)
})

it('+/-: should alter pending sign', () => {
  btn9()
  expectPending(9)
  btnChangeSign()
  expectPending(-9)
  btnChangeSign()
  expectPending(9)
})

it('+/-: should alter stack sign', () => {
  btn9()
  btnEnter()
  expectStack(9)
  btnChangeSign()
  expectStack(-9)
  btnChangeSign()
  expectStack(9)
})

it('leftshift_+/-: (RAND) if pending, should be random integer less than pending value', () => {
  const attempts = 30 // Arbitrary
  for (let i=0; i<attempts; i++) {
      btn1()
      btn2()
      btnRand()
      const val = getLcd().trim()
      const intVal = parseInt(val)
      expect(intVal).toEqual(val)
      expect(intVal >= 0 && intVal < 12).toBeTruthy()
      btnDeleteChar() // Remove randomly generated integer.
  }
})

it('leftshift_+/-: (RAND) if stack, should be random float less than 1', () => {
  let oldVal = ''
  const attempts = 30 // Arbitrary
  for (let i=0; i<attempts; i++) {
      btnRand()
      const str = getLcd().trim()
      expect(str.length > 15)
      expect(str.startsWith('0.')).toBeTruthy()
      const flt = parseFloat(str)
      expect(flt < 1.0).toBeTruthy()
      expect(flt > 0.0).toBeTruthy()
      expect(str != oldVal).toBeTruthy()
      btnDeleteChar() // Remove value from stack
      oldVal = str
  }
})

it('rightshift_+/-: (MOD) should mod pending', () => {
  btn9()
  btnEnter()
  btn2()
  expectPending([9,2])
  btnMod()
  expectStack(1)
})

it('leftshift_+/-: (MOD) should mod stack', () => {
  btn9()
  btnEnter()
  btn2()
  btnEnter()
  expectStack([9,2])
  btnMod()
  expectStack(1)
})

it('eex: should prepend 1 automatically', () => {
  btnExpo()
  expectPending('1e')
})

it('eex: should exponent', () => {
  btn2()
  btnExpo()
  btn3()
  btnEnter()
  expectStack(2000)
})

it('leftshift_eex: (C(y,x)) should combination pending', () => {
  btn6()
  btnEnter()
  btn3()
  expectPending([6,3])
  btnCombo()
  expectStack(20)
})

it('leftshift_eex: (C(y,x)) should combination stack', () => {
  btn6()
  btnEnter()
  btn3()
  btnEnter()
  expectStack([6,3])
  btnCombo()
  expectStack(20)
})

it('rightshift_eex: (x!) should factorial pending', () => {
  btn5()
  expectPending(5)
  btnFact()
  expectStack(120)
})

it('rightshift_eex: (x!) should factorial stack', () => {
  btn5()
  btnEnter()
  expectStack(5)
  btnFact()
  expectStack(120)
})

it('delete: should remove 1 character from pending', () => {
  btn2()
  btn3()
  btn4()
  expectPending([234])
  btnDeleteChar()
  expectPending([23])
})

it('leftshift_delete: (none) should do nothing to pending', () => {
  btn2()
  btn3()
  btn4()
  expectPending([234])
  btnLeftShift()
  btnDeleteChar()
  expectPending([234])
})

it('leftshift_delete: (none) should do nothing to stack', () => {
  btn2()
  btn3()
  btn4()
  btnEnter()
  expectStack([234])
  btnLeftShift()
  btnDeleteChar()
  expectStack([234])
})

it('rightshift_delete: (CLEAR) should clear all when pending', () => {
  btn2()
  btnSto()
  btn3()
  expectPending(3)
  expect(getStoreInd()).toEqual('S=2')
  btnClear()
  expectStack('')
  expect(getStoreInd()).toEqual('')
})

it('rightshift_delete: (CLEAR) should clear all when stack', () => {
  btn2()
  btnSto()
  btn3()
  btnEnter()
  expectStack(3)
  expect(getStoreInd()).toEqual('S=2')
  btnClear()
  expectStack('')
})

it('sin: should sine pending', () => {
  btn3()
  btn0()
  expectPending(30)
  btnSin()
  expectStack('0.5')
})

it('sin: should sine stack', () => {
  btn3()
  btn0()
  btnEnter()
  expectStack(30)
  btnSin()
  expectStack('0.5')
})

it('leftshift_sin: (ASIN) should arcsine pending', () => {
  btn0()
  btnDot()
  btn5()
  expect(isBlinking()).toBeTruthy()
  btnAsin()
  expect(isBlinking()).toBeFalsy()
  expect(getLcd()).toEqual(toLcd(30))
})

it('leftshift_sin: (ASIN) should arcsine stack', () => {
  btn0()
  btnDot()
  btn5()
  btnEnter()
  expectStack('0.5')
  btnAsin()
  expectStack(30)
})

it('rightshift_sin: (none) should do nothing to pending', () => {
  btn0()
  btnDot()
  btn5()
  expectPending('0.5')
  btnRightShift()
  btnSin()
  expectPending('0.5')
})

it('rightshift_sin: (none) should do nothing to stack', () => {
  btn0()
  btnDot()
  btn5()
  btnEnter()
  btnRightShift()
  btnSin()
  expectStack('0.5')
})

it('cos: should cosine pending', () => {
  btn6()
  btn0()
  expectPending(60)
  btnCos()
  expectStack('0.5')
})

it('cos: should cosine stack', () => {
  btn6()
  btn0()
  btnEnter()
  expectStack(60)
  btnCos()
  expectStack('0.5')
})

it('leftshift_cos: (ACOS) should arcsine pending', () => {
  btn0()
  btnDot()
  btn5()
  expectPending('0.5')
  btnAcos()
  expectStack(60)
})

it('leftshift_cos: (ACOS) should arcsine stack', () => {
  btn0()
  btnDot()
  btn5()
  btnEnter()
  expectStack('0.5')
  btnAcos()
  expectStack(60)
})

it('rightshift_cos: (none) should do nothing to pending', () => {
  btn0()
  btnDot()
  btn5()
  expectPending('0.5')
  btnRightShift()
  btnCos()
  expectPending('0.5')
})

it('rightshift_cos: (none) should do nothing to stack', () => {
  btn0()
  btnDot()
  btn5()
  btnEnter()
  expectStack('0.5')
  btnRightShift()
  btnCos()
  expectStack('0.5')
})

it('tan: should tangent pending', () => {
  btn4()
  btn5()
  expectPending(45)
  btnTan()
  expectStack(1)
})

it('tan: should tangent stack', () => {
  btn4()
  btn5()
  btnEnter()
  expectStack(45)
  btnTan()
  expectStack(1)
})

it('leftshift_tan: (ATAN) should arctangent pending', () => {
  btn1()
  expectPending(1)
  btnAtan()
  expectStack(45)
})

it('leftshift_tan: (ATAN) should arctangent stack', () => {
  btn1()
  btnEnter()
  expectStack(1)
  btnAtan()
  expectStack(45)
})

it('rightshift_tan: (none) should do nothing to pending', () => {
  btn1()
  expectPending(1)
  btnRightShift()
  btnTan()
  expectPending(1)
})

it('rightshift_tan: (none) should do nothing to stack', () => {
  btn1()
  btnEnter()
  expectStack(1)
  btnRightShift()
  btnTan()
  expectStack(1)
})

it('1/x: should inverse pending', () => {
  btn4()
  expectPending(4)
  btnRecip()
  expectStack('0.25')
})

it('1/x: should inverse stack', () => {
  btn4()
  btnEnter()
  btnRecip()
  expect(getLcd()).toEqual(toLcd(0.25))
})

it('leftshift_1/x: (e^x) should exp pending', () => {
  btn2()
  expectPending(2)
  btnPowex()
  expect(isBlinking()).toBeFalsy()
  expect(getLcd().trim().startsWith('7.389056098')).toBeTruthy()
})

it('leftshift_1/x: (e^x) should exp stack', () => {
  btn2()
  btnEnter()
  expectStack(2)
  btnPowex()
  expect(getLcd().trim().startsWith('7.389056098')).toBeTruthy()
})

it('rightshift_1/x: (LN) should ln pending', () => {
  btn4()
  expectPending(4)
  btnLn()
  expect(isBlinking()).toBeFalsy()
  expect(getLcd().trim().startsWith('1.3862943611')).toBeTruthy()
})

it('rightshift_1/x: (LN) should ln stack', () => {
  btn4()
  btnEnter()
  expectStack(4)
  btnLn()
  expect(getLcd().trim().startsWith('1.3862943611')).toBeTruthy()
})

it('y^x: should pow pending', () => {
  btn2()
  btnEnter()
  btn3()
  expectPending([2,3])
  btnPowyx()
  expectStack(8)
})

it('y^x: should pow stack', () => {
  btn2()
  btnEnter()
  btn3()
  btnEnter()
  expectStack([2,3])
  btnPowyx()
  expectStack(8)
})

it('leftshift_y^x: (10^x) should pow10 pending', () => {
  btn3()
  expect(isBlinking()).toBeTruthy()
  expectPending(3)
  btnPow10x()
  expectStack(1000)
})

it('leftshift_y^x: (10^x) should pow10 stack', () => {
  btn3()
  btnEnter()
  expectStack(3)
  btnPow10x()
  expectStack(1000)
})

it('rightshift_y^x: (LOG) should log10 pending', () => {
  btn1()
  btn0()
  btn0()
  expectPending(100)
  btnLog()
  expectStack(2)
})

it('rightshift_y^x: (LOG) should log10 stack', () => {
  btn1()
  btn0()
  btn0()
  btnEnter()
  expectStack(100)
  btnLog()
  expectStack(2)
})

it('sto: should store pending', () => {
  expect(getStoreInd()).toEqual('')
  btn3()
  expectPending(3)
  btnSto()
  expect(getStoreInd()).toEqual('S=3')
  expectStack('')
})

it('sto: should store stack', () => {
  expect(getStoreInd()).toEqual('')
  btn3()
  btnEnter()
  expectStack(3)
  btnSto()
  expect(getStoreInd()).toEqual('S=3')
  expectStack('')
})

it('leftshift_sto: (RCL) should recall pending', () => {
  btn3()
  btnSto()
  btn5()
  expectPending(5)
  btnRcl()
  expectStack([5,3])
  expect(getStoreInd()).toEqual('S=3')
})

it('leftshift_sto: (RCL) should recall stack', () => {
  btn3()
  btnSto()
  btn5()
  btnEnter()
  expectStack(5)
  btnRcl()
  expectStack([5,3])
  expect(getStoreInd()).toEqual('S=3')
})

it('rightshift_sto: (AND) should And pending', () => {
  btn5()
  btnEnter()
  btn3()
  expectPending([5,3])
  btnAnd()
  expectStack(1)
})

it('rightshift_sto: (AND) should And stack', () => {
  btn5()
  btnEnter()
  btn3()
  btnEnter()
  expectStack([5,3])
  btnAnd()
  expectStack(1)
})

it('disp: should change precision when pending', () => {
  expect(getPrecisionInd()).toEqual('ALL')
  btnDisp()
  expect(getPrecisionInd()).toEqual('FIX')
  btnDisp()
  // Start on SCI because FIX consumes a pending value.
  expect(getPrecisionInd()).toEqual('SCI')
  btn2()
  expectPending(2)
  btnDisp()
  expect(getPrecisionInd()).toEqual('ALL')
  expectPending(2)
  btnDisp()
  expect(getPrecisionInd()).toEqual('FIX')
  expectPending(2)
})

it('disp: pending integer value should set precision', () => {
  btn7()
  btnEnter()
  expectStack(7)
  expect(getPrecisionInd()).toEqual('ALL')
  btnDisp()
  expect(getPrecisionInd()).toEqual('FIX')
  btn2()
  expectPending(['7.0000','2'])
  btnDisp()
  expectStack('7.00')
  expect(getPrecisionInd()).toEqual('FIX')
  btnDisp()
  expect(getPrecisionInd()).toEqual('SCI')
  expectStack('7.00e+0')
  btnDisp()
  expect(getPrecisionInd()).toEqual('ALL')
  expectStack(7)
})

it('disp: pending non-integer value should set not set precision', () => {
  btn7()
  btnEnter()
  expectStack(7)
  btnDisp()
  expect(getPrecisionInd()).toEqual('FIX')
  btn1()
  btnDot()
  btn2()
  btn8()
  expectPending(['7.0000', '1.28'])
  btnDisp()
  expectPending(['7.0000e+0', '1.28'])
  expect(getPrecisionInd()).toEqual('SCI')
})

it('disp: pending negative value should not set precision', () => {
  btn7()
  btnEnter()
  expectStack(7)
  btnDisp()
  expect(getPrecisionInd()).toEqual('FIX')
  btn1()
  btnChangeSign()
  expectPending(['7.0000', '-1'])
  btnDisp()
  expectPending(['7.0000e+0', '-1'])
  expect(getPrecisionInd()).toEqual('SCI')
})

it('disp: pending integer 16 should set precision', () => {
  btn7()
  btnEnter()
  expectStack(7)
  btnDisp()
  expect(getPrecisionInd()).toEqual('FIX')
  btn1()
  btn6()
  expectPending(['7.0000', '16'])
  btnDisp()
  expectStack('7.0000000000000000')
  expect(getPrecisionInd()).toEqual('FIX')
})

it('disp: pending integer greater than 16 should set precision to 16', () => {
  btn7()
  btnEnter()
  expectStack(7)
  btnDisp()
  expect(getPrecisionInd()).toEqual('FIX')
  btn1()
  btn7()
  expectPending(['7.0000', '17'])
  btnDisp()
  expectStack('7.0000000000000000')
  expect(getPrecisionInd()).toEqual('FIX')
})

it('disp: should change disp when stack', () => {
  btn7()
  btnEnter()
  expectStack(7)
  expect(getPrecisionInd()).toEqual('ALL')
  btnDisp()
  expect(getPrecisionInd()).toEqual('FIX')
  expectStack('7.0000')
  btnDisp()
  expect(getPrecisionInd()).toEqual('SCI')
  expectStack('7.0000e+0')
})

it('leftshift_disp: (none) should do nothing to pending', () => {
  btn5()
  expectPending(5)
  btnLeftShift()
  btnDisp()
  expectPending(5)
})

it('leftshift_disp: (none) should do nothing to stack', () => {
  btn5()
  btnEnter()
  expectStack(5)
  btnLeftShift()
  btnDisp()
  expectStack(5)
})

it('rightshift_disp: (NOT) should Not pending', () => {
  btn5()
  expectPending(5)
  btnNot()
  expectStack(-6)
})

it('rightshift_disp: (NOT) should Not stack', () => {
  btn5()
  btnEnter()
  expectStack(5)
  btnNot()
  expectStack(-6)
})

it('base: should change base and accept pending', () => {
  expect(getBaseInd()).toEqual('10')

  btn1()
  expectPending(1)
  btnBase()
  expect(getBaseInd()).toEqual('16')
  expectStack('0x1')
  btnDeleteChar()

  btn1()
  expectPending(1)
  btnBase()
  expectStack('0b00000001')
  btnDeleteChar()

  btn1()
  expectPending(1)
  btnBase()
  expectStack('0o1')
  btnDeleteChar()

  btn1()
  expectPending(1)
  btnBase()
  expect(getBaseInd()).toEqual('10')
  expectStack(1)
  btnDeleteChar()
})

it('base: should change base and not alter stack', () => {
  expect(getBaseInd()).toEqual('10')
  btn1()
  btnEnter()
  expectStack(1)
  btnBase()
  expect(getBaseInd()).toEqual('16')
  expectStack('0x1')
  btnBase()
  expect(getBaseInd()).toEqual('2')
  expectStack('0b00000001')
  btnBase()
  expect(getBaseInd()).toEqual('8')
  expectStack('0o1')
  btnBase()
  expect(getBaseInd()).toEqual('10')
  expectStack(1)
})

it('leftshift_base: (MODE) should change mode if pending', () => {
  expect(getModeInd()).toEqual('DEG')
  btn6()
  expectPending(6)
  btnMode()
  expect(getModeInd()).toEqual('RAD')
  expectPending(6)
  btnMode()
  expect(getModeInd()).toEqual('DEG')
})

it('leftshift_base: (MODE) should change mode if stack', () => {
  expect(getModeInd()).toEqual('DEG')
  btn6()
  btnEnter()
  expectStack(6)
  btnMode()
  expect(getModeInd()).toEqual('RAD')
  expectStack(6)
  btnMode()
  expect(getModeInd()).toEqual('DEG')
})

it('rightshift_base: (OR) should Or pending', () => {
  btn5()
  btnEnter()
  btn3()
  expectPending([5,3])
  btnOr()
  expectStack(7)
})

it('rightshift_base: (OR) should Or stack', () => {
  btn5()
  btnEnter()
  btn3()
  btnEnter()
  expectStack([5,3])
  btnOr()
  expectStack(7)
})


it('sqrt: should sqrt pending', () => {
  btn9()
  expectPending(9)
  btnSqrt()
  expectStack(3)
})

it('sqrt: should sqrt stack', () => {
  btn9()
  btnEnter()
  expectStack(9)
  btnSqrt()
  expectStack(3)
})

it('leftshift_sqrt: (rootxy) should Rootxy pending', () => {
  btn8()
  btnEnter()
  btn3()
  expectPending([8,3])
  btnRootxy()
  expectStack(2)
})

it('leftshift_sqrt: (rootxy) should Rootxy stack', () => {
  btn8()
  btnEnter()
  btn3()
  btnEnter()
  expectStack([8,3])
  btnRootxy()
  expectStack(2)
})

it('rightshift_sqrt: (XOR) should Xor pending', () => {
  btn5()
  btnEnter()
  btn3()
  expectPending([5,3])
  btnXor()
  expectStack(6)
})

it('rightshift_sqrt: (XOR) should ln stack', () => {
  btn5()
  btnEnter()
  btn3()
  btnEnter()
  expectStack([5,3])
  btnXor()
  expectStack(6)
})

it('swap: should swap when pending', () => {
  btn2()
  btnEnter()
  btn3()
  expectPending([2,3])
  btnSwap()
  expectStack([3,2])
})

it('swap: should swap when stack', () => {
  btn2()
  btnEnter()
  btn3()
  btnEnter()
  expectStack([2,3])
  btnSwap()
  expectStack([3,2])
})

it('leftshift_swap: (none) should do nothing to pending', () => {
  btn2()
  btnEnter()
  btn3()
  expectPending([2,3])
  btnLeftShift()
  btnSwap()
  expectPending([2,3])
})

it('leftshift_swap: (none) should do nothing to stack', () => {
  btn2()
  btnEnter()
  btn3()
  btnEnter()
  expectStack([2,3])
  btnLeftShift()
  btnSwap()
  expectStack([2,3])
})

it('rightshift_swap: (UNDO) should undo pending operation', () => {
  btn2()
  btnEnter()
  btn3()
  expectPending([2,3])
  btnAdd()
  expectStack(5)
  btnUndo()
  expectStack([2,3])
})

it('rightshift_swap: (UNDO) should undo stack operation', () => {
  btn2()
  btnEnter()
  btn3()
  btnEnter()
  expectStack([2,3])
  btnAdd()
  expectStack(5)
  btnUndo()
  expectStack([2,3])
})


// ####################################################

it('default mode to degrees', () => {
    expect(getModeInd()).toEqual('DEG')
    btn3()
    btn0()
    btnEnter()
    expectStack(30)
    btnSin()
    expectStack('0.5')
})

it('should calculate radians', () => {
    expect(getModeInd()).toEqual('DEG')
    btnMode()
    expect(getModeInd()).toEqual('RAD')
    btnTau()
    btn4()
    btnDivide()
    btnSin()
    expect(getLcd()).toEqual(toLcd('1'))
})

it('should accept decimal point without leading zero', () => {
    btnDot()
    expectPending('.')
    btn4()
    expectPending('.4')
    btnEnter()
    expectStack('0.4')
})

it('should not accept two decimal points', () => {
    btn1()
    btnDot()
    expectPending('1.')
    btnDot()
    expectPending('1.')
    btn3()
    expectPending('1.3')
    btnDot()
    expectPending('1.3')
})

it('should accept exponent with no prefix', () => {
    btnExpo()
    expectPending('1e')
    btn2()
    expectPending('1e2')
    btnEnter()
    expectStack('100')
})

it('should ignore missing exponent', () => {
    btn1()
    btnDot()
    btn4()
    btnExpo()
    expectPending('1.4e')
    btnEnter()
    expectStack('1.4')
})

it('should not accept two exponents', () => {
    btn1()
    btnExpo()
    expectPending('1e')
    btnExpo()
    expectPending('1e')
    btn2()
    expectPending('1e2')
})

it('should negate exponent', () => {
    btnExpo()
    btn2()
    expectPending('1e2')
    btnChangeSign()
    expectPending('1e-2')
    btnChangeSign()
    expectPending('1e2')
})


it('should accept bin values', () => {
    btnBase()
    btnBase()
    expect(getBaseInd()).toEqual('2')
    btn1()
    btn0()
    expectPending(10)
    btn2()
    btn3()
    btn4()
    btn5()
    btn6()
    btn7()
    btn8()
    btn9()
    btnDot()
    expectPending(10)
    btnEnter()
    expectStack('0b00000010')
})

it('should accept oct values', () => {
    btnBase()
    btnBase()
    btnBase()
    expect(getBaseInd()).toEqual('8')
    btn7()
    btn6()
    btn5()
    btn4()
    btn3()
    btn2()
    btn1()
    btn0()
    expectPending(76543210)
    btn8()
    btn9()
    btnDot()
    expectPending(76543210)
    btnEnter()
    expectStack('0o76543210')
})

it('should accept dec values', () => {
    expect(getBaseInd()).toEqual('10')
    btn9()
    btn8()
    btn7()
    btn6()
    btnDot()
    btn5()
    btn4()
    btn3()
    btn2()
    btn0()
    btn1()
    expectPending('9876.543201')
    btnEnter()
    expectStack('9876.543201')
})

it('should accept hex values', () => {
    btnBase()
    expect(getBaseInd()).toEqual('16')
    btn9()
    btn8()
    btn7()
    btn6()
    btn5()
    btn4()
    btn3()
    btn2()
    expectPending('98765432')
    btnEnter()
    expectStack('0x98765432')
    btnDeleteChar()
    
    btn1()
    btn0()
    btnHexA()
    btnHexB()
    btnHexC()
    btnHexD()
    btnHexE()
    btnHexF()
    expectPending('10ABCDEF')
    btnEnter()
    expectStack('0x10ABCDEF')
})

it('base2 should format 32-bit binary', () => {
    btn2()
    btnEnter()
    btn3()
    btn1()
    btnEnter()
    expectStack([2,31])
    btnPowyx()
    btnBase()
    btnBase()
    expect(getBaseInd()).toEqual(2)
    expectStack('0b10000000_00000000_00000000_00000000')
})

it('base2 negative values should be prefixed with eight 1s', () => {
    btn5()
    btnChangeSign()
    btnBase()
    btnBase()
    expect(getBaseInd()).toEqual('2')
    expectStack('0b11111111_11111011')
})

it('base2 should allow an exponent', () => {
    btnBase()
    btnBase()
    expect(getBaseInd()).toEqual('2')
    btn1()
    btn0()
    btnExpo()
    btn1()
    btn0()
    btn1()
    expectPending('10e101')
    btnEnter()
    expectStack('0b00000011_00001101_01000000')
})

it('base8 should allow an exponent', () => {
    btnBase()
    btnBase()
    btnBase()
    expect(getBaseInd()).toEqual('8')
    btn6()
    btnExpo()
    btn3()
    expectPending('6e3')
    btnEnter()
    expectStack('0o13560')
})

it('base8 negative values should be prefixed with minus sign', () => {
    btnBase()
    btnBase()
    btnBase()
    expect(getBaseInd()).toEqual('8')
    btn4()
    btnChangeSign()
    expectPending('-4')
    btnEnter()
    expectStack('-0o4')
})

it('base16 should allow an exponent', () => {
    btnBase()
    expect(getBaseInd()).toEqual('16')
    btnHexB()
    btnExpo()
    btnHexA()
    expectPending('BeA')
    btnEnter()
    expectStack('0x199C82CC00')
})

it('base16 negative values should be prefixed with minus sign', () => {
    btnBase()
    expect(getBaseInd()).toEqual('16')
    btnHexA()
    btnChangeSign()
    expectPending('-A')
    btnEnter()
    expectStack('-0xA')
})

it('should store a large stack', () => {
    const stk = []
    const limit = 100 // Arbitrary
    for (let i=0; i<limit; i++) {
        if (i % 10 == 0) { btn0(); stk.unshift(0) }
        if (i % 10 == 1) { btn1(); stk.unshift(1) }
        if (i % 10 == 2) { btn2(); stk.unshift(2) }
        if (i % 10 == 3) { btn3(); stk.unshift(3) }
        if (i % 10 == 4) { btn4(); stk.unshift(4) }
        if (i % 10 == 5) { btn5(); stk.unshift(5) }
        if (i % 10 == 6) { btn6(); stk.unshift(6) }
        if (i % 10 == 7) { btn7(); stk.unshift(7) }
        if (i % 10 == 8) { btn8(); stk.unshift(8) }
        if (i % 10 == 9) { btn9(); stk.unshift(9) }
        btnEnter()
    }
    expect(STACK).toEqual(stk)
    expectStack(stk.slice(0,4).reverse())
})


it('should handle keyboard base10 numbers', () => {
    _kbd('9')
    _kbd('8')
    _kbd('7')
    _kbd('6')
    _kbd('5')
    _kbd('4')
    _kbd('3')
    _kbd('2')
    _kbd('1')
    _kbd('0')
    _kbd('.')
    _kbd('5')
    expectPending('9876543210.5')
})
//    _kbd('.')

it('should handle keyboard base16 numbers', () => {
    _kbd('b')
    expect(getBaseInd()).toEqual('16')
    _kbd('F')
    _kbd('E')
    _kbd('D')
    _kbd('C')
    _kbd('B')
    _kbd('A')
    expectPending('FEDCBA')
})

it('should handle keyboard backspace, escape', () => {
    _kbd('4')
    _kbd('5')
    _kbd('Enter')

    _kbd('1')
    _kbd('2')
    _kbd('3')
    expectPending(['45', '123'])
    _kbd('Backspace')
    expectPending(['45', '12'])
    _kbd('Escape')
    expectStack('45')
})

it('should handle keyboard +, -, /, *', () => {
    _kbd('6')
    _kbd('Enter')
    _kbd('2')
    _kbd('+')
    expectStack('8')
    _kbd('Backspace')

    _kbd('6')
    _kbd('Enter')
    _kbd('2')
    _kbd('-')
    expectStack('4')
    _kbd('Backspace')

    _kbd('6')
    _kbd('Enter')
    _kbd('2')
    _kbd('/')
    expectStack('3')
    _kbd('Backspace')

    _kbd('6')
    _kbd('Enter')
    _kbd('2')
    _kbd('*')
    expectStack('12')
    _kbd('Backspace')
})

it('should handle keyboard leftShift, rightShift', () => {
    expect(getLeftShiftInd()).toEqual('')
    _kbd('[')
    expect(getLeftShiftInd()).toEqual(getLeftShiftIndChar())
    _kbd('[')
    expect(getLeftShiftInd()).toEqual('')

    expect(getRightShiftInd()).toEqual('')
    _kbd(']')
    expect(getRightShiftInd()).toEqual(getRightShiftIndChar())
    _kbd(']')
    expect(getRightShiftInd()).toEqual('')
})

it('should handle keyboard Base', () => {
    expect(getBaseInd()).toEqual('10')
    _kbd('b')
    expect(getBaseInd()).toEqual('16')
})

it('should handle keyboard Sin', () => {
    _kbd('3')
    _kbd('0')
    expectPending('30')
    _kbd('s')
    expectStack('0.5')
})

it('should handle keyboard Cos', () => {
    _kbd('6')
    _kbd('0')
    expectPending('60')
    _kbd('c')
    expectStack('0.5')
})

it('should handle keyboard Tan', () => {
    _kbd('4')
    _kbd('5')
    expectPending('45')
    _kbd('t')
    expectStack('1')
})

it('should handle keyboard BASE', () => {
    expect(getBaseInd()).toEqual('10')
    _kbd('b')
    expect(getBaseInd()).toEqual('16')
})

it('should handle keyboard DISP', () => {
    expect(getPrecisionInd()).toEqual('ALL')
    _kbd('d')
    expect(getPrecisionInd()).toEqual('FIX')
})

it('should handle keyboard EEX', () => {
    _kbd('e')
    _kbd('3')
    expectPending('1e3')
})

it('should handle keyboard STO', () => {
    expect(getStoreInd()).toEqual('')
    _kbd('3')
    _kbd('o')
    expect(getStoreInd()).toEqual('S=3')
    expectStack('')
})

it('should handle keyboard +/-', () => {
    _kbd('3')
    expectPending('3')
    _kbd('p') // plus/minus
    expectPending('-3')
})

it('should handle keyboard SQRT', () => {
    _kbd('9')
    _kbd('q')
    expectStack('3')
})

it('should handle keyboard RECIP', () => {
    _kbd('4')
    _kbd('r')
    expectStack('0.25')
})
it('should handle keyboard SWAP', () => {
    _kbd('4')
    _kbd('Enter')
    _kbd('3')
    _kbd('w')
    expectStack([3,4])
})

it('should handle keyboard POWYX', () => {
    _kbd('2')
    _kbd('Enter')
    _kbd('3')
    _kbd('y')
    expectStack(8)
})


all_tests_passed()   // Update the LCD with test results.
