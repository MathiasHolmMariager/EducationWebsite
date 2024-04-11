function GoogleMaps() {
  return (
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2599.3901224246843!2d9.988981277169266!3d57.0123952942769!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x464eccdc3b849cf3%3A0xf858a47b27302972!2sCassiopeia%20-%20Institut%20for%20Datalogi%2C%20Selma%20Lagerl%C3%B8fs%20Vej%20300%2C%209220%20Aalborg!5e1!3m2!1sda!2sdk!4v1712823764726!5m2!1sda!2sdk"
      width="100%"
      height="500"
      style={{ border: "0" }}
      allowFullScreen={true}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  );
}

export default GoogleMaps;