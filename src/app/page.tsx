// pages/index.tsx
import Head from 'next/head';
import Game from '@/components/Game';

const Home: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Color Game</title>
      </Head>
      <main className="flex justify-center w-screen h-screen">
        <Game />
      </main>
    </div>
  );
};

export default Home;
