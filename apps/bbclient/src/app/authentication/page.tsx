"use client";

import styles from "./authenticationPage.module.scss";
import { UserAuthForm } from "./components/UserAuthForm";

const MAIN_DESCRIPTION = "Simple money tracking, easier budgeting";
const SUB_DESCRIPTION = "© 2025 by Jaemin Kim";

const LoginForm: React.FC = () => {
  return (
    <div className={styles.formContainer}>
      <div className={styles.header}>
        <h1>Budget Book</h1>
        <p>Enter your email</p>
      </div>
      <UserAuthForm />
      <p className={styles.terms}>By Jaemin Kim</p>
    </div>
  );
};

const LoginFormLogo: React.FC = () => {
  return <div className={styles.logo}>Budget Book</div>;
};

export default function AuthenticationPage() {
  return (
    <>
      {/* Mobile View */}
      <div className={styles.mobileContainer}>
        <LoginForm />
      </div>

      {/* Desktop View */}
      <div className={styles.pageContainer}>
        <div className={styles.leftPanel}>
          <div className={styles.overlay}></div>
          <div className={styles.quote}>
            <blockquote>
              <p className={styles.mainText}>{MAIN_DESCRIPTION}</p>
              <span className={styles.subText}>{SUB_DESCRIPTION}</span>
            </blockquote>
          </div>
        </div>

        <div className={styles.rightPanel}>
          <LoginForm />
        </div>
      </div>
    </>
  );
}
