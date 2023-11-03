import Header from './Header';
import GetStarted from './GetStarted';
import GetInTouch from './GetInTouch';
import Footer from './Footer';
import Navbar from './Navbar';
import { getStarted } from './helpers';
import LazyShow from './Animated/LazyShow';
import Canvas from './Animated/Canvas';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import accountStore from 'src/store/accountStore';
import { useNavigate } from 'react-router-dom';

const LandingView = observer(() => {
  const navigate = useNavigate();
  const account = accountStore.account;
  useEffect(() => {
    if (!!account?.id) {
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account?.id]);

  return (
    <>
      <Navbar />
      <Header />
      <LazyShow>
        <Canvas />
      </LazyShow>
      {getStarted.map((item, index) => (
        <GetStarted
          key={index}
          title1={item.title1}
          title2={item.title2}
          imgDetail1={item.imgDetail1}
          imgDetail2={item.imgDetail2}
          content1={item.content1}
          content2={item.content2}
        />
      ))}
      <LazyShow>
        <Canvas />
      </LazyShow>
      <LazyShow>
        <GetInTouch />
      </LazyShow>
      <Footer />
    </>
  );
});

export default LandingView;
