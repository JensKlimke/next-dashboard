import React from "react";
import CountUp from "react-countup";
import styles from '../../styles/General.module.scss'

export interface LargeNumberPropsI {
  muted?: boolean;
  pre?: string;
  post?: string;
  value: number;
  decimals: number;
}

export default function LargeNumber({muted, pre, value, decimals, post}: LargeNumberPropsI) {
  return (
    <span className={'display-4 ' + (muted ? ` ${styles.textVeryMuted}` : '')}>
      {pre && <span>{pre}&nbsp;</span>}
      {value && <CountUp end={value} duration={0.5} decimals={decimals} />}
      {post && <span>&nbsp;{post}</span>}
    </span>
  );
}
