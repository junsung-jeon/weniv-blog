export default function Hero({ children }) {
  return (
    <div style={styles.hero}>
      {/* 왼쪽 어두운 패널 */}
      <div style={styles.leftPanel}>
        {children}
      </div>
      {/* 오른쪽 하늘 이미지 */}
      <div style={styles.rightPanel} />
    </div>
  );
}

const styles = {
  hero: {
    display: 'grid',
    gridTemplateColumns: '38% 62%',
    height: 300,
    overflow: 'hidden',
  },
  leftPanel: {
    background: 'linear-gradient(135deg, #2c3e60 0%, #4a6080 100%)',
    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    padding: '32px 40px',
    color: '#fff',
  },
  rightPanel: {
    backgroundImage: `url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&auto=format&fit=crop')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
};
