import mammoth from 'mammoth';
import fs from 'fs';
import { globSync } from 'glob';

const docxPattern = '/Users/chenmo/代码/Trae/24 chunfen/*.docx';
const docxFiles = globSync(docxPattern);

if (docxFiles.length === 0) {
  console.log('❌ 未找到 docx 文件');
  process.exit(1);
}

const docxPath = docxFiles[0];
const mdPath = '/Users/chenmo/代码/Trae/24 chunfen/产品需求文档-春分立蛋主题活动.md';

console.log(`📄 找到文件: ${docxPath}`);

async function convertDocxToMd() {
  try {
    const result = await mammoth.convertToHtml({
      path: docxPath
    });

    const html = result.value;
    
    // Simple HTML to Markdown conversion
    let md = html
      // Headers
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
      .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
      // Bold and italic
      .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b>(.*?)<\/b>/gi, '**$1**')
      .replace(/<em>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i>(.*?)<\/i>/gi, '*$1*')
      // Lists
      .replace(/<ul[^>]*>/gi, '\n')
      .replace(/<\/ul>/gi, '\n')
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
      .replace(/<ol[^>]*>/gi, '\n')
      .replace(/<\/ol>/gi, '\n')
      // Paragraphs and line breaks
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
      .replace(/<br\s*\/?>/gi, '\n')
      // Remove remaining HTML tags
      .replace(/<[^>]+>/g, '')
      // Clean up extra whitespace
      .replace(/\n{3,}/g, '\n\n')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim();

    // Extract title from first h1 or use filename
    const titleMatch = md.match(/^#\s+(.+)/);
    const title = titleMatch ? titleMatch[1] : '产品需求文档';
    
    // Add metadata header
    const frontmatter = `---
title: "${title}"
date: "${new Date().toISOString().split('T')[0]}"
---

`;
    
    const finalMd = frontmatter + md;

    fs.writeFileSync(mdPath, finalMd, 'utf8');
    console.log(`✅ 转换完成！`);
    console.log(`📄 Markdown 文件已保存到: ${mdPath}`);
  } catch (error) {
    console.error('❌ 转换失败:', error);
  }
}

convertDocxToMd();
