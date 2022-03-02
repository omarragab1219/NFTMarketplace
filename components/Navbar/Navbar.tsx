import styles from "./Navbar.module.css";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className={styles.container}>
      <div className={styles.twoOptionContainers}>
        <Link href="/">
          <a className={styles.option}>Home</a>
        </Link>
        <Link href="/create-item">
          <a className={styles.option}>Sell Digital Asset</a>
        </Link>
      </div>
      <div className={styles.twoOptionContainers}>
        <Link href="/my-assets">
          <a className={styles.option}>My Digital Assets</a>
        </Link>
        <Link href="/creator-dashboard">
          <a className={styles.option}>Creator Dashboard</a>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
