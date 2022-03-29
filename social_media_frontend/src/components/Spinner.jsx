import React from "react";
import { Circles } from "react-loader-spinner";

const style = {
  wrapper: `flex flex-col justify-center items-center w-full h-full`,
  txtStyle: `text-lg text-center px-2`,
};

//spinner to display when loading
const Spinner = ({ message }) => {
  return (
    <div className={style.wrapper}>
      <Circles color="#437FC7" height={50} width={200} className="m-5" />
      <p className={style.txtStyle}>{message}</p>
    </div>
  );
};

export default Spinner;
