import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const samplesDir = path.join(process.cwd(), "public", "samples");
    if (!fs.existsSync(samplesDir)) {
      return NextResponse.json({ samples: [] });
    }

    const categories = fs.readdirSync(samplesDir).filter((file) => {
      return fs.statSync(path.join(samplesDir, file)).isDirectory();
    });

    const allSamples: { category: string; path: string; filename: string }[] = [];

    for (const category of categories) {
      const categoryPath = path.join(samplesDir, category);
      const files = fs.readdirSync(categoryPath).filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return ext === ".jpg" || ext === ".jpeg" || ext === ".png";
      });

      for (const file of files) {
        allSamples.push({
          category,
          path: `/samples/${category}/${file}`,
          filename: file,
        });
      }
    }

    return NextResponse.json({ samples: allSamples });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
