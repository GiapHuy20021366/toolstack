import { useContext } from "react";
import { ApplicationContext } from "@/contexts/common/ApplicationContext";

export default function useApplicationContext() {
    const context = useContext(ApplicationContext);
    return context;
}
