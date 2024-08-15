import React, { useState } from 'react';

const PurchaseStorage = () => {
  const [storage, setStorage] = useState();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchaseClick = () => {
    setShowModal(true);
  };

  const handleConfirmPurchase = async () => {
    setIsLoading(true);
    
    // Simuler l'intégration de paiement
    try {
      // Intégration d'une API de paiement ici, ex : Stripe, PayPal, etc.
      // const paymentResult = await processPayment(storagePrice);

      // Si le paiement est réussi, ajouter l'espace de stockage
      setStorage(storage + 20);
      setShowModal(false);
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      // Gérer l'erreur de paiement ici
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* <h2>Acheter plus d'espace de stockage !</h2> */}
      <button onClick={handlePurchaseClick}>Acheter 20 Go pour 20€</button>

      {showModal && (
        <div className="modal">
          <h3>Confirmer l'achat</h3>
          <p>Voulez-vous vraiment acheter 20 Go pour 20€ ?</p>
          <button onClick={handleConfirmPurchase} disabled={isLoading}>
            {isLoading ? 'Paiement en cours...' : 'Confirmer'}
          </button>
          <button onClick={() => setShowModal(false)} disabled={isLoading}>
            Annuler
          </button>
        </div>
      )}
    </div>
  );
};

export default PurchaseStorage;