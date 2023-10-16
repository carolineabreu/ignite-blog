// import commonStyles from '../styles/common.module.scss';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { getPrismicClient } from '../services/prismic';
import commonStyle from '../styles/common.module.scss';
import { capitalizeTime } from '../utils/capitalize';
import styles from './home.module.scss';
import Header from '../components/Header';

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

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState(postsPagination?.results);
  const [nextPage, setNextPage] = useState(postsPagination?.next_page);

  // pagination está funcionando, o que falta: entrar na página do desafio e ver os próximos passos e fazer o css

  function handleLoadPosts(): void {
    fetch(nextPage)
      .then(res => res.json())
      .then(data => {
        const formattedPosts = data.results.map(post => {
          return {
            uid: post.uid,
            first_publication_date: format(
              new Date(post.first_publication_date),
              'dd MMM yyyy',
              {
                locale: ptBR,
              }
            ),
            data: {
              title: post.data.title,
              subtitle: post.data.subtitle,
              author: post.data.author,
            },
          };
        });

        setPosts(state => [...state, ...formattedPosts]);
        setNextPage(data.next_page);
      });
  }

  return (
    <>
      <Head>
        <title>Posts | spacetraveling</title>
      </Head>

      <Header />

      <main className={`${commonStyle.container}`}>
        <div className={styles.posts}>
          {posts.map(post => {
            return (
              <div className={styles.post} key={post.uid}>
                <Link href={`/post/${post.uid}`}>
                  <h1>{post.data.title}</h1>
                </Link>
                <p>{post.data.subtitle}</p>
                <div className={commonStyle.infos}>
                  <div className={commonStyle.infosItem}>
                    <FiCalendar />
                    <time>{capitalizeTime(post.first_publication_date)}</time>
                  </div>
                  <div className={commonStyle.infosItem}>
                    <FiUser />
                    <span>{post.data.author}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {nextPage && (
          <button
            className={styles.button}
            type="button"
            onClick={handleLoadPosts}
          >
            Carregar mais posts
          </button>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.getByType('posts', {
    pageSize: 1,
  });

  const results = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM yyyy',
        {
          locale: ptBR,
        }
      ),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  const postsPagination = {
    next_page: postsResponse.next_page,
    results,
  };

  return {
    props: {
      postsPagination,
    },
  };
};
