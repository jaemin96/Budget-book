"use client";

import { useState } from "react";
import styles from "./userAuthForm.module.scss";
import inputStyles from "../../../components/Form/fields/styles/input.module.scss";
import { useMutation } from "@apollo/client";
import { LOGIN } from "@/graphql/mutations/Auth";
import { Eye, EyeOff } from "lucide-react";
import { Spinner } from "@/components";
import { useRouter } from "next/navigation";

export function UserAuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loginMutation, { loading }] = useMutation(LOGIN);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await loginMutation({
        variables: {
          email,
          password,
        },
        context: {
          fetchOptions: {
            credentials: "include",
          },
        },
      });

      if (result?.data?.login?.result) {
        await new Promise((r) => setTimeout(r, 100));
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Login error:", err);
    }
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
      <div
        style={{
          position: "relative",
        }}
      >
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className={inputStyles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {showPassword ? (
            <EyeOff size={16} color={"gray"} />
          ) : (
            <Eye size={16} color={"gray"} />
          )}
        </button>
      </div>
      <button type="submit">{loading ? <Spinner /> : `LOGIN`}</button>
    </form>
  );
}
