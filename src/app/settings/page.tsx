"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { getMarketSettings, saveMarketSettings } from "@/lib/format";
import { MARKETS, CURRENCY_CONFIG, DEFAULT_MARKET_SETTINGS } from "@/types/market";

export default function SettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_MARKET_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load settings from localStorage
    const currentSettings = getMarketSettings();
    setSettings(currentSettings);
    setIsLoading(false);
  }, []);

  const handleSave = () => {
    saveMarketSettings(settings);
    toast({
      title: "Settings saved",
      description: "Your market preferences have been updated.",
    });
  };

  const handleReset = () => {
    setSettings(DEFAULT_MARKET_SETTINGS);
    saveMarketSettings(DEFAULT_MARKET_SETTINGS);
    toast({
      title: "Settings reset",
      description: "Market preferences have been reset to defaults.",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your default market preferences and display options.
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Market Preferences</CardTitle>
            <CardDescription>
              Set your default market, currency, and locale for property displays.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="default-market">Default Market</Label>
                <Select
                  value={settings.defaultMarket}
                  onValueChange={(value) =>
                    setSettings({ ...settings, defaultMarket: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select market" />
                  </SelectTrigger>
                  <SelectContent>
                    {MARKETS.map((market) => (
                      <SelectItem key={market.id} value={market.id}>
                        {market.name}, {market.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-currency">Default Currency</Label>
                <Select
                  value={settings.defaultCurrency}
                  onValueChange={(value) =>
                    setSettings({ ...settings, defaultCurrency: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CURRENCY_CONFIG).map(([code, config]) => (
                      <SelectItem key={code} value={code}>
                        {config.symbol} {config.name} ({code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-locale">Default Locale</Label>
              <Select
                value={settings.defaultLocale}
                onValueChange={(value) =>
                  setSettings({ ...settings, defaultLocale: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select locale" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="en-GB">English (UK)</SelectItem>
                  <SelectItem value="en-IN">English (India)</SelectItem>
                  <SelectItem value="en-AU">English (Australia)</SelectItem>
                  <SelectItem value="en-CA">English (Canada)</SelectItem>
                  <SelectItem value="en-SG">English (Singapore)</SelectItem>
                  <SelectItem value="ar-AE">Arabic (UAE)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border rounded-lg p-4 bg-muted/50">
              <h4 className="font-medium mb-2">Preview</h4>
              <div className="text-sm space-y-1">
                <p>
                  <span className="text-muted-foreground">Market:</span>{" "}
                  {MARKETS.find(m => m.id === settings.defaultMarket)?.name || "Unknown"}
                </p>
                <p>
                  <span className="text-muted-foreground">Currency:</span>{" "}
                  {CURRENCY_CONFIG[settings.defaultCurrency as keyof typeof CURRENCY_CONFIG]?.symbol || settings.defaultCurrency}{" "}
                  {CURRENCY_CONFIG[settings.defaultCurrency as keyof typeof CURRENCY_CONFIG]?.name || "Unknown"}
                </p>
                <p>
                  <span className="text-muted-foreground">Locale:</span>{" "}
                  {settings.defaultLocale}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSave}>Save Settings</Button>
              <Button variant="outline" onClick={handleReset}>
                Reset to Defaults
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Global Platform Features</CardTitle>
            <CardDescription>
              This platform is designed to scale globally with multi-market support.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Supported Markets:</span>
                <span className="font-medium">{MARKETS.length} markets</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Supported Currencies:</span>
                <span className="font-medium">{Object.keys(CURRENCY_CONFIG).length} currencies</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">AI-Driven Scoring:</span>
                <span className="font-medium">✓ Market-aware</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Currency Adaptation:</span>
                <span className="font-medium">✓ Auto-detection</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
