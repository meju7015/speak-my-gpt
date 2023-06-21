import dotenv from 'dotenv';

dotenv.config();

const prompt: string = process.argv[2] ?? '';

if (!prompt) {
  console.error('대화할 내용을 입력해주세요.');
  process.exit(1);
}
