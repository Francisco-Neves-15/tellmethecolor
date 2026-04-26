"use client";
// import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

// Style
import useGlobalStyles from "@/hooks/useGlobalStyles";
import fStyles from "./style.module.scss"

// Hooks
import { useI18n } from "@/hooks/useI18n";

// Icons
import { LuHouse } from "react-icons/lu";

// Components
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

      {/* Testes de Botões */}

      <Link href={"/settings"}>
        <Button>
          link + button
        </Button>
      </Link>

      <Button>buton + text</Button>
      <Button><LuHouse size={24} /> Color </Button>
      
      <Button><Text size="button">buton + text</Text></Button>

      <Button>button</Button>
      <Button color="primary" variant="outline" underline><LuHouse size={24} /> button underline</Button>

      <Link href={"/settings"} style={{ textDecoration: "none" }}>
        <Button>
          <Text size="display">link + button + text</Text>
        </Button>
      </Link>

      {/* Testes de Botões */}

      <Link href={"/settings"}>link</Link>
    </Container>
  );
}
