"use client";

import { useEffect } from "react";
import {Crisp} from 'crisp-sdk-web';

export const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("c0ca12d1-5f7f-446e-a746-fa2a5759441c");
    } , []);

    return null;
}