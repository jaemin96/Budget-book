'use client';

import counter, { counterInitialState, decrease, increase, reset, setAmount } from '@/store/counter';
import { useEffect, useReducer, useRef, useState } from 'react';

const Page = () => {
  const amountRef = useRef(null);
  const [amountValue, setAmountValue] = useState<number>(0);
  const [counterState, dispatch] = useReducer(counter, counterInitialState);

  useEffect(() => {
    console.log({ counterState });

    return () => {};
  }, [counterState]);

  return (
    <>
      <h2>{`Counter Current Value: ${counterState.value}`}</h2>
      <h2>{`Counter Current Amount: ${counterState.amount}`}</h2>
      <form ref={amountRef}>
        <input type="number" value={amountValue} onChange={(e) => setAmountValue(+e.target.value)} />
        <button
          type="submit"
          onClick={(event) => {
            event.preventDefault();
            dispatch(setAmount(amountValue));
          }}
        >
          SAVE
        </button>
      </form>
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          dispatch(increase());
        }}
      >
        INCREASE
      </button>
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          dispatch(decrease());
        }}
      >
        DECREASE
      </button>
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          dispatch(reset());
        }}
      >
        RESET
      </button>
    </>
  );
};

export default Page;
