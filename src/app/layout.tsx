'use client';
import React from 'react';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>DefinitiveSpec | The AI-Native Methodology for High-Quality Software</title>
        <meta name="description" content="DefinitiveSpec is an AI-native development methodology that transforms precise specifications into verified, high-quality code."></meta>
        <link rel="canonical" href="https://definitivespec.org/"></link>
        <link rel="icon" href="/favicon.ico" sizes="any"></link>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png"></link>
        <meta property="og:title" content="DefinitiveSpec: From Idea to Audited Code, Automatically"></meta>
        <meta property="og:description" content="DefinitiveSpec is an AI-native development methodology that transforms precise specifications into high-quality, verified software. Stop debating ambiguity and start shipping with certainty."></meta>
        <meta property="og:type" content="website"></meta>
        <meta property="og:url" content="https://definitivespec.org/"></meta>
        {/* <meta property="og:image" content="https://www.definitivespec.io/og-image.png"></meta> */}
        <meta property="og:site_name" content="DefinitiveSpec"></meta>
        {/* <meta name="twitter:card" content="summary_large_image"></meta> */}
        <meta name="twitter:title" content="DefinitiveSpec: From Idea to Audited Code, Automatically"></meta>
        <meta name="twitter:description" content="An AI-native development methodology that transforms precise specifications into verified, high-quality code. Stop debating ambiguity and ship with certainty."></meta>
        {/* <meta name="twitter:image" content="https://www.definitivespec.io/twitter-card-image.png"></meta> */}
        <meta name="twitter:site" content="@DefinitiveSpec"></meta>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
} 