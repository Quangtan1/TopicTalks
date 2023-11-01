import Carousel from 'react-multi-carousel';
import { IPost } from 'src/queries';
import '../PostItem.scss';
import { isEmptyArray } from 'formik';
import { responsive } from 'src/components/layouts/home/homepage/HomePage';

const SimplePost = ({ posts, handleClickPostItem }) => {
  return (
    <Carousel ssr partialVisbile itemClass="image-item-simple" responsive={responsive}>
      {!isEmptyArray(posts) &&
        posts?.slice(0, 5).map((post: IPost) => {
          return (
            <img
              style={{ width: '100%', height: '100%' }}
              alt="img"
              className="img"
              src={post?.img_url}
              onClick={() => handleClickPostItem(post?.id)}
            />
          );
        })}
    </Carousel>
  );
};

export default SimplePost;
