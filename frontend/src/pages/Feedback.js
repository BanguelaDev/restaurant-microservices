import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { feedbackService } from '../services/api';

const Feedback = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
    category: 'geral'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Get user ID from current user
      const userId = currentUser?.uid || currentUser?.email || currentUser?.id;
      
      if (!userId) {
        setError('Usuário não autenticado');
        setLoading(false);
        return;
      }

      console.log('Submitting feedback for user:', userId);

      // Prepare feedback data
      const feedbackData = {
        user_id: userId,
        rating: parseInt(formData.rating),
        comment: formData.comment,
        category: formData.category
      };

      console.log('Feedback data:', feedbackData);

      // Submit feedback to backend
      const response = await feedbackService.createFeedback(feedbackData);
      
      if (response.data.success) {
        setSuccess(true);
        setFormData({
          rating: 5,
          comment: '',
          category: 'geral'
        });
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      } else {
        setError('Erro ao enviar feedback. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
      
      if (error.response?.status === 503) {
        setError('Serviço de feedback indisponível. Tente novamente mais tarde.');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Erro ao enviar feedback. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white font-display">
            Enviar Feedback
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
            Sua opinião é muito importante para nós!
          </p>
        </div>

        {success && (
          <div className="mb-8 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 text-success-700 dark:text-success-400 px-6 py-4 rounded-xl animate-fade-in">
            <div className="flex items-center justify-center space-x-3">
              <svg className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div className="text-center">
                <p className="font-medium">Feedback enviado com sucesso!</p>
                <p className="text-sm mt-1">Obrigado por compartilhar sua opinião conosco.</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 shadow-soft border border-gray-200 dark:border-gray-700 rounded-2xl p-8 transition-all duration-300 hover:shadow-lg">
          <form className="space-y-8" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-4 rounded-xl animate-fade-in">
                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="font-medium">{error}</p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Categoria
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
              >
                <option value="geral">Geral</option>
                <option value="comida">Qualidade da Comida</option>
                <option value="atendimento">Atendimento</option>
                <option value="entrega">Entrega</option>
                <option value="app">Aplicativo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Avaliação
              </label>
              <div className="flex items-center space-x-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className={`text-3xl transition-all duration-200 hover:scale-110 ${
                      star <= formData.rating ? 'text-warning-400' : 'text-gray-300 dark:text-gray-600'
                    } hover:text-warning-400`}
                  >
                    ★
                  </button>
                ))}
                <span className="ml-3 text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {formData.rating} {formData.rating === 1 ? 'estrela' : 'estrelas'}
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Comentário
              </label>
              <textarea
                id="comment"
                name="comment"
                rows={5}
                value={formData.comment}
                onChange={handleChange}
                placeholder="Conte-nos sobre sua experiência..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 resize-none"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Enviando...</span>
                  </div>
                ) : (
                  'Enviar Feedback'
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 shadow-soft border border-gray-200 dark:border-gray-700 rounded-2xl p-8 transition-all duration-300 hover:shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 font-display flex items-center">
            <svg className="w-6 h-6 mr-3 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Dicas para um bom feedback:
          </h3>
          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              Seja específico sobre o que gostou ou não gostou
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              Mencione detalhes sobre o serviço ou produto
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              Sua opinião nos ajuda a melhorar continuamente
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              Todos os feedbacks são analisados pela nossa equipe
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
