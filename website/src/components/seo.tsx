import Head from "next/head";
import { useEffect, useState } from "react";

export default function Seo({
  title,
  description,
}: {
  title?: string;
  description: string;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, [title]);

  return (
    <Head>
      {isMounted && title ? (
        <title>{title} - Shortzoo</title>
      ) : (
        <title>Shortzoo</title>
      )}
      <meta name="description" content={description} />
    </Head>
  );
}
