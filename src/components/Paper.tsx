import React from "react";
import styles from '../styles/Paper.module.css'

export default function Paper({children} : {children: React.ReactNode}) {
  return (
    <div className={styles.Paper}>
      {children}
    </div>
  )
}
