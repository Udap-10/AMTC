import Image from 'next/image';

const MyComponent = () => (
  <div>
    <Image
      src="/images/logos/2.jpg"
      alt="Description"
      width={500}  // Set default width
      height={300} // Set default height
      layout="responsive"  // Makes it responsive
    />
  </div>
);

export default MyComponent;
