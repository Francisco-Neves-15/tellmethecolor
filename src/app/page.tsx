"use client";
// import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

// Style
import useGlobalStyles from "@/hooks/useGlobalStyles";
import fStyles from "./style.module.scss"

// Hooks
import { useI18n } from "@/hooks/useI18n";

// Components
import Container from "@/components/layout/Container";
import View from "@/components/ui/View";
import Text from "@/components/ui/Text";

export default function Home() {

  const tHome = useI18n("pag-home");

  const { gColors } = useGlobalStyles();

  return (
    <Container padding>

      <View className="flex flex-row gap-4">
        <Link href={"/settings"}>settings</Link>
        <Link href={"/layout_test"}>layout_test</Link>
      </View>

      <View className={fStyles.content}>
        Test
        {/* <Link href={"/layout_test/"}>Teste</Link> */}
        {/* <Link href={"/settings/"}>Setting</Link> */}
      </View>

    </Container>
  );
}
