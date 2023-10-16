import { GetStaticPaths, GetStaticProps } from 'next';

import { RichText } from 'prismic-dom';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getPrismicClient } from '../../services/prismic';
import commonStyles from '../../styles/common.module.scss';
import { capitalizeTime } from '../../utils/capitalize';
import styles from './post.module.scss';
import Header from '../../components/Header';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
  timeReading: string;
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Carregando...</h1>;
  }

  return (
    <>
      <Head>
        <title>{post.data.title} | spacetraveling</title>
      </Head>

      <Header />

      <img
        className={styles.banner}
        src={post.data.banner.url}
        alt={post.data.title}
      />
      <div className={`${commonStyles.container} ${styles.container}`}>
        <div className={styles.header}>
          <h1>{post.data.title}</h1>
          <div className={commonStyles.infos}>
            <div className={commonStyles.infosItem}>
              <FiCalendar />
              <time>{capitalizeTime(post.first_publication_date)}</time>
            </div>
            <div className={commonStyles.infosItem}>
              <FiUser />
              <span>{post.data.author}</span>
            </div>
            <div className={commonStyles.infosItem}>
              <FiClock />
              <span>{post.timeReading}</span>
            </div>
          </div>
        </div>
        <div className={styles.post}>
          {post.data.content.map(current => {
            return (
              <div key={current.heading} className={styles.postGroup}>
                <h2>{current.heading}</h2>
                <div
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(current.body),
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.getByType('posts');
  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient();

  const { slug } = params;
  const response = await prismic.getByUID('posts', String(slug), {});

  const totalOfWords = response.data.content.reduce((total, text) => {
    const words = RichText.asText(text.body).trim().split(/\s+/).length;
    return total + words;
  }, 0);

  const reading = Math.ceil(totalOfWords / 200);

  const post = {
    first_publication_date: format(
      new Date(response.first_publication_date),
      'dd MMM yyyy',
      {
        locale: ptBR,
      }
    ),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content.map(content => ({
        heading: content.heading,
        body: [...content.body], // RichText.asHtml(content.body),
      })),
    },
    timeReading: `${reading} min`,
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 30, // 30 minutes
  };
};
