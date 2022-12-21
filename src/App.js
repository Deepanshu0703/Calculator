
import {useReducer} from 'react';



const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      }
    case ACTIONS.CLEAR:
      return {}
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        }
      }
      if (state.currentOperand == null) return state
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null }
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      }
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      }
    default:
      return state

  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "÷":
      computation = prev / current
      break
    default:
      return
  }

  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})
function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split(".")
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  )
  return (
    <>
   <center>Calculator</center>
      <div className="container">

        <div className="item1"><div className="smaller">{formatOperand(previousOperand)}{operation}</div>
        <div  className="bigger">{formatOperand(currentOperand)}</div>
        </div>
        <div className="item2" onClick={()=>dispatch({type:ACTIONS.CLEAR})}>AC</div>
        <div className="item3" onClick={()=>dispatch({type:ACTIONS.DELETE_DIGIT})}>Del</div>  
        <div className="item4" onClick={()=>dispatch({type:ACTIONS.CHOOSE_OPERATION,payload:{operation:'÷'}})}>÷</div>
        <div className="item5" onClick={()=>dispatch({type:ACTIONS.ADD_DIGIT,payload:{digit:'1'}})}>1</div>
        <div className="item6" onClick={()=>dispatch({type:ACTIONS.ADD_DIGIT,payload:{digit:'2'}})}>2</div>
        <div className="item7" onClick={()=>dispatch({type:ACTIONS.ADD_DIGIT,payload:{digit:'3'}})}>3</div>
        <div className="item8" onClick={()=>dispatch({type:ACTIONS.CHOOSE_OPERATION,payload:{operation:'*'}})}>x</div>
        <div className="item9" onClick={()=>dispatch({type:ACTIONS.ADD_DIGIT,payload:{digit:'4'}})}>4</div>
        <div className="item10" onClick={()=>dispatch({type:ACTIONS.ADD_DIGIT,payload:{digit:'5'}})}>5</div>
        <div className="item11" onClick={()=>dispatch({type:ACTIONS.ADD_DIGIT,payload:{digit:'6'}})}>6</div>
        <div className="item12" onClick={()=>dispatch({type:ACTIONS.CHOOSE_OPERATION,payload:{operation:'-'}})}>-</div>
        <div className="item13" onClick={()=>dispatch({type:ACTIONS.ADD_DIGIT,payload:{digit:'7'}})}>7</div>
        <div className="item14" onClick={()=>dispatch({type:ACTIONS.ADD_DIGIT,payload:{digit:'8'}})}>8</div>
        <div className="item15" onClick={()=>dispatch({type:ACTIONS.ADD_DIGIT,payload:{digit:'9'}})}>9</div>
        <div className="item16" onClick={()=>dispatch({type:ACTIONS.CHOOSE_OPERATION,payload:{operation:'+'}})}>+</div>
        <div className="item17" onClick={()=>dispatch({type:ACTIONS.ADD_DIGIT,payload:{digit:'0'}})}>0</div>
        <div className="item18" onClick={()=>dispatch({type:ACTIONS.ADD_DIGIT,payload:{digit:"."}})}>.</div>
        <div className="item19" onClick={()=>dispatch({type:ACTIONS.EVALUATE})}>=</div>
      </div>
        
      
      </>
  );
}
export default App;