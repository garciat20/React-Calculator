import { useReducer } from 'react';
import './App.css'
import DigitButton  from './DigitButtons';
import OperationButton from './OperationButton';

// EXPORT ACTIONS AND WORK ON BUTTON

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  DELETE_DIGIT: 'delete-digit',
  CLEAR: 'clear',
  EVALUATE: 'evaluate'
}

// type,payload = action, diff actions, diff types of those actions and 
// those actions will pass along different actions (payload)
function reducer(state, { type, payload }){
  switch(type){
    case ACTIONS.ADD_DIGIT:
      // everytime overwrite is true, an equation has been computed,
      // now after someone hits a number, it should overtake the output generated
      if (state.overwrite){
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      }
      // first if says, if 1st digit is 0, dont add more 0's its redundant
      if (payload.digit === '0' && state.currentOperand === '0') {return state}
      // second if says, if a number has decimal, dont add more decimals
      if (payload.digit === '.' && state.currentOperand.includes(".")) {return state}
      return {
        ...state, currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }
    case ACTIONS.CHOOSE_OPERATION:
      // if theres nothing entered yet in calculator, dont just insert an operator
      if (state.currentOperand == null && state.previousOperand == null){
        return state
      }

      if (state.currentOperand == null){
        // if we have a prevOperand, but we want to add instead of subtract, we can override
        // the current operation with the new one we want
        return{
          ...state,
          operation: payload.operation,

        }
      }

      if (state.previousOperand == null){
        // if we typed something in the calculator, but nothing else was typed beforehand
        // simply set the previous as the current, and update current to nothing
          return {
            ...state,
            operation: payload.operation,
            previousOperand: state.currentOperand,
            currentOperand: null,
          }
        }
        // if nothing is null, then every time we click on operation, do the math
        // and evaluate numbers
        return {
          ...state,
          previousOperand: evaluate(state),
          operation: payload.operation,
          currentOperand: null,
        }
      
    case ACTIONS.CLEAR:
      return {}

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite){
        return {
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }
      // if theres no current operand, dont do anything, nothing to delete
      if (state.currentOperand == null) {return state}
      // if only one digit, set it to null
      if (state.currentOperand.length === 1){
        return {
          ...state,
          currentOperand: null
        }
      }

        return {
          ...state,
          currentOperand: state.currentOperand.slice(0, -1)
        }
      
    case ACTIONS.EVALUATE:
      // if anything is empty, do nothing 
      if (state.operation == null || state.currentOperand == null || 
        state.previousOperand == null){
          return state
        }
        // if everything is not empty, clear the prevOperand, operation, then 
        // evaluate the equation, and set the currOperand as the output
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state)
      }
    default: break
  }
}

function evaluate({previousOperand, currentOperand, operation}){
  // convert strings to numbers
  const prev = parseFloat(previousOperand)
  const curr = parseFloat(currentOperand)
  // nan is not a number
  if (isNaN(prev) || isNaN(curr)) {return ""}// no calculation to do so return empty string
  let computation = ""
  switch (operation){
    case "+":
      computation = prev + curr
      break
    case "-":
      computation = prev - curr
      break
    case "*":
      computation = prev * curr
      break
    case "÷":
      computation = prev / curr
      break
      
    default: break
    }
    
    return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us",{
  maximumFractionDigits: 0,
})

function formatOperand(operand){
  if (operand == null){return }
  const [integer, decimal] = operand.split(".")
  // if no decimal
  if (decimal == null)return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  )
  // console.log('cur oper'+currentOperand)
  return (
    <div className='calculator-grid'>
      <div className='result'>
        <div className='previous-operand'>{previousOperand} {operation}</div>
        <div className='current-operand'>{formatOperand(currentOperand)}</div>
      </div>
      {/* top of calculator has 3 buttons, not 4, so exapnd top row */}
        <button className='span-two' onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
        <button onClick={() => dispatch ({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
        <OperationButton operation='÷' dispatch={dispatch}/>
        <DigitButton digit='1' dispatch={dispatch}/>
        <DigitButton digit='2' dispatch={dispatch}/>
        <DigitButton digit='3' dispatch={dispatch}/>
        <OperationButton operation='*' dispatch={dispatch}/>
        <DigitButton digit='4' dispatch={dispatch}/>
        <DigitButton digit='5' dispatch={dispatch}/>
        <DigitButton digit='6' dispatch={dispatch}/>
        <OperationButton operation='+' dispatch={dispatch}/>
        <DigitButton digit='7' dispatch={dispatch}/>
        <DigitButton digit='8' dispatch={dispatch}/>
        <DigitButton digit='9' dispatch={dispatch}/>
        <OperationButton operation='-' dispatch={dispatch}/>
        <DigitButton digit='0' dispatch={dispatch}/>
        <DigitButton digit='.' dispatch={dispatch}/>
        <button className='span-two'
        onClick={() => dispatch ({type: ACTIONS.EVALUATE})}>=</button>
    </div>

  );
}

export default App;
