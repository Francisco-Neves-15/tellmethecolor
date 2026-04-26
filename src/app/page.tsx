"use client";
// import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

// Style
import useGlobalStyles from "@/hooks/useGlobalStyles";
import fStyles from "./style.module.scss"

// Hooks
import { useI18n } from "@/hooks/useI18n";

// Components

// Icons
import Container from "@/components/ui/Container";
import View from "@/components/ui/View";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";

export default function Home() {
  const tHome = useI18n("pag-home");

  const { gColors } = useGlobalStyles();

  return (
    <Container padding>
      <View className={fStyles.content}>
        Test
        {/* <Link href={"/layout_test/"}>Teste</Link> */}
        {/* <Link href={"/settings/"}>Setting</Link> */}
      </View>
      <Button variant="main" color="primary">Continuar</Button>
      <Button variant="sub">Continuar</Button>
      <Button variant="outline" color="primary">Continuar</Button>
      <Link href={"/settings"}>
        <Button>
          Configurações
        </Button>
      </Link>
      <Link href={"/settings"}>
        <Button>
          <Text size="display">Configurações</Text>
        </Button>
      </Link>
      <Link href={"/settings"}>Configurações</Link>
    </Container>
  );
}
