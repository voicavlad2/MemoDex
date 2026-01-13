import React, {useState} from "react";
import {FaRegEye, FaRegEyeSlash} from "react-icons/fa6";

const PasswordInput = ({value, onChange, placeholder}) => {
    
    const [dontShowPassword, ShowPassword] = useState(false);
    const toggleShowPassword = () => {
        ShowPassword(!dontShowPassword); 
    } 
    
    return (
        <div className="flex items-center bg-transparent border-[1.5px] px-5 rounded mb-3">
            <input 
            value={value} 
            onChange={onChange} 
            type={dontShowPassword ? "text" : "Password"} 
            placeholder={placeholder || "Password"}
            className="w-full text-sm bg-transparent py-3 mr-3 rounded outline-none"
            /> 
            {dontShowPassword ? (
                <FaRegEye
                size={22}
                className="text-blue-400 cursor-pointer"
                onclick={() => toggleShowPassword()}
                /> 
            ) : (
                <FaRegEyeSlash
                size={22}
                className="text-blue-400 cursor-pointer"
                onclick={() => toggleShowPassword()}
                />
            )}      
        </div>
    )
}

export default PasswordInput;