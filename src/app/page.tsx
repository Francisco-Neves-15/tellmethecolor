"use client";
// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";

// Style
import useGlobalStyles from "@/hooks/useGlobalStyles";
import fStyles from "./style.module.scss"

// Hooks
import { useI18n } from "@/hooks/useI18n";

// Components

// Icons
import Container from "@/components/ui/Container";
import View from "@/components/ui/View";
import Button from "@/components/ui/Button";

export default function Home() {
  const tHome = useI18n("pag-home");

  const { gColors } = useGlobalStyles();

  return (
    <Container padding>
      <View>
        Test
        {/* <Link href={"/layout_test/"}>Teste</Link> */}
        {/* <Link href={"/settings/"}>Setting</Link> */}
      </View>
      <Button variant="main" color="primary">Continuar</Button>
      <Button variant="sub">Continuar</Button>
      <Button variant="outline" color="primary">Continuar</Button>
      
    </Container>
  );
}
