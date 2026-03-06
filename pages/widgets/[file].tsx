import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function WidgetFileHandler(req: NextApiRequest, res: NextApiResponse) {
  const { file } = req.query;
  if (!file || typeof file !== 'string') {
    return res.status(400).json({ error: 'File name is required' });
  }

  const filePath = path.join(process.cwd(), 'widgets', file);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  // 获取文件的MIME类型
  const ext = path.extname(file).toLowerCase();
  let mimeType = 'application/octet-stream';
  if (ext === '.js') {
    mimeType = 'application/javascript';
  } else if (ext === '.fwd') {
    mimeType = 'application/json';
  }

  // 设置响应头
  res.setHeader('Content-Type', mimeType);
  res.setHeader('Content-Disposition', `inline; filename="${file}"`);
  
  // 读取文件并返回
  const fileContent = fs.readFileSync(filePath);
  return res.send(fileContent);
}

// 配置API路由不使用静态生成
export const getServerSideProps = async () => {
  return { props: {} };
};
