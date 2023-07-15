// import commonStyles from '../styles/common.module.scss';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { getPrismicClient } from '../services/prismic';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home(): JSX.Element {
  return (
    <>
      <Head>
        <title>Posts | spacetraveling</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a>
            <h1>Como utilizar Hooks</h1>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div className={styles.footer}>
              <div>
                <FiCalendar />
                <time>15 Mar 2021</time>
              </div>
              <div>
                <FiUser />
                <span>Joseph Oliveira</span>
              </div>
            </div>
          </a>
          <a>
            <h1>Como utilizar Hooks</h1>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div>
              <div>
                <FiCalendar />
                <time>15 Mar 2021</time>
              </div>
              <div>
                <FiUser />
                <span>Joseph Oliveira</span>
              </div>
            </div>
          </a>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.getByType('posts', {
    fetch: ['posts.title', 'posts.subtitle', 'posts.content', 'posts.author'],
    pageSize: 100,
  });

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(postsResponse, null, 2));

  return {
    props: {},
  };
};
