"use client";

import { useState } from "react";
import styles from "./userAuthForm.module.scss";
import inputStyles from "../../../components/Form/fields/styles/input.module.scss";

export function UserAuthForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="email"
        placeholder="you@example.com"
        className={inputStyles.input}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Continue</button>
    </form>
  );
}
