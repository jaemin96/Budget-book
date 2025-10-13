"use client";

import styles from "./authenticationPage.module.scss";
import Link from "next/link";
import { UserAuthForm } from "./components/UserAuthForm";

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
          <div className={styles.quote}>
            <blockquote>
              <p>“Main description”</p>
              <footer>jaemin kim</footer>
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

// return (
//   <div className="flex flex-col gap-2 p-4">
//     <input
//       placeholder="email"
//       value={email}
//       onChange={(e) => setEmail(e.target.value)}
//       className="border p-2"
//     />
//     <input
//       placeholder="password"
//       type="password"
//       value={password}
//       onChange={(e) => setPassword(e.target.value)}
//       className="border p-2"
//     />
//     <button
//       onClick={handleLogin}
//       className="bg-blue-500 text-white p-2 rounded"
//     >
//       로그인
//     </button>
//   </div>
// );
