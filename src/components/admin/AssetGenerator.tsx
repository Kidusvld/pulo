
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

type AssetType = "og" | "favicon" | "placeholder";

export const AssetGenerator = () => {
  const [loading, setLoading] = useState<AssetType | null>(null);
  const [generatedUrls, setGeneratedUrls] = useState<Record<AssetType, string>>({
    og: "",
    favicon: "",
    placeholder: "",
  });

  const generateAsset = async (type: AssetType) => {
    setLoading(type);
    try {
      const { data, error } = await supabase.functions.invoke("generate-assets", {
        body: { type }
      });

      if (error) throw error;

      if (data.output && data.output[0]) {
        setGeneratedUrls(prev => ({
          ...prev,
          [type]: data.output[0]
        }));
      }
    } catch (error) {
      console.error(`Error generating ${type}:`, error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Generate PULO Assets</h2>
        <p className="text-gray-600">
          Generate assets for the PULO application. Download and save them in the appropriate format.
        </p>
      </div>

      {/* OG Image */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">OG Image</h3>
            <p className="text-sm text-gray-600">1200x630px PNG format</p>
          </div>
          <Button 
            onClick={() => generateAsset("og")}
            disabled={loading === "og"}
          >
            {loading === "og" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate OG Image
          </Button>
        </div>
        {generatedUrls.og && (
          <div className="relative aspect-[1.91/1] w-full max-w-2xl border rounded-lg overflow-hidden">
            <img 
              src={generatedUrls.og} 
              alt="Generated OG Image" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Favicon */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Favicon</h3>
            <p className="text-sm text-gray-600">Convert to ICO format after downloading</p>
          </div>
          <Button 
            onClick={() => generateAsset("favicon")}
            disabled={loading === "favicon"}
          >
            {loading === "favicon" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Favicon
          </Button>
        </div>
        {generatedUrls.favicon && (
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 border rounded-lg overflow-hidden">
              <img 
                src={generatedUrls.favicon} 
                alt="Generated Favicon" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-8 h-8 border rounded-lg overflow-hidden">
              <img 
                src={generatedUrls.favicon} 
                alt="Generated Favicon Preview" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {/* Placeholder */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Placeholder</h3>
            <p className="text-sm text-gray-600">Convert to SVG format after downloading</p>
          </div>
          <Button 
            onClick={() => generateAsset("placeholder")}
            disabled={loading === "placeholder"}
          >
            {loading === "placeholder" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Placeholder
          </Button>
        </div>
        {generatedUrls.placeholder && (
          <div className="w-full max-w-md aspect-square border rounded-lg overflow-hidden">
            <img 
              src={generatedUrls.placeholder} 
              alt="Generated Placeholder" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-50 rounded-lg space-y-2">
        <h3 className="font-semibold">Next Steps:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
          <li>Download each generated image</li>
          <li>Convert the favicon to .ico format using a tool like realfavicongenerator.net</li>
          <li>Convert the placeholder to .svg format using a vector conversion tool</li>
          <li>Replace the files in your project's public directory:</li>
          <ul className="ml-6 list-disc space-y-1 mt-1">
            <li>public/og-image.png</li>
            <li>public/favicon.ico</li>
            <li>public/placeholder.svg</li>
          </ul>
        </ol>
      </div>
    </div>
  );
};
