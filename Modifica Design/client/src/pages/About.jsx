import 'bootstrap/dist/css/bootstrap.min.css';

export default function About() {
  return (
    <div>
      <div className='jumbotron jumbotron-fluid text-white bg-dark'>
        <div className='container text-center'>
          <h1 className='display-4'>Chi siamo?</h1>
          <p className='lead'>
            Siamo un gruppo appassionato di studenti che si impegna a condividere conoscenze, esperienze e risorse con la nostra comunità di lettori.
            Qui troverai articoli informativi, guide pratiche e approfondimenti.
          </p>
        </div>
      </div>

      <div className='container my-5'>
        <div className='row justify-content-center'>
          <div className='col-12 col-md-10 col-lg-8'>
            <h2 className='text-center mb-4'>Unisciti alla nostra community</h2>
            <div className='text-muted'>
              <p>
                Se sei curioso, desideroso di imparare e desideri essere parte di una comunità che valorizza la conoscenza e l'interazione, sei nel posto giusto.
                Insieme possiamo esplorare nuove idee, risolvere problemi e ispirarci a vicenda.
              </p>
              <p>
                Potrai commentare e mettere mi piace a tutti i post che vorrai, però abbiamo bisogno prima che ti unisca alla nostra community andando a registrarti.
              </p>
              <p>
                Una volta fatto questo, farai parte della famiglia! Quindi cosa aspetti? Unisciti a noi!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
