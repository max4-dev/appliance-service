import { LoginForm } from "@/features/auth/ui";
import styles from "./LoginPage.module.css";

export const LoginPage = () => {
  return <div className={styles.login}><LoginForm /></div>;
};