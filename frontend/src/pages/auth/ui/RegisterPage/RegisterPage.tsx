import { RegisterForm } from "@/features/auth/ui";
import styles from "./RegisterPage.module.css";

export const RegisterPage = () => {
  return <div className={styles.register}><RegisterForm /></div>;
};
