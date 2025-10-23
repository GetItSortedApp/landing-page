// Firebase configuration
// Replace these values with your actual Firebase project configuration
// You can find these in your Firebase Console: Project Settings > General > Your apps > SDK setup and configuration

const firebaseConfig = {
  apiKey: "AIzaSyCnxnNbQjp8vOgDAWienytLSipmioQYiIU",
  authDomain: "alistair-sorted-landing-page.firebaseapp.com",
  databaseURL: "https://alistair-sorted-landing-page-default-rtdb.firebaseio.com",
  projectId: "alistair-sorted-landing-page",
  storageBucket: "alistair-sorted-landing-page.firebasestorage.app",
  messagingSenderId: "1090039322071",
  appId: "1:1090039322071:web:701f6a962315cc1d20e792",
  measurementId: "G-J25FEXXMEX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Analytics
const analytics = firebase.analytics();

// Get a reference to the database
const database = firebase.database();

// Form submission handler
function handleFormSubmit(event, formId) {
  event.preventDefault();

  const form = event.target;
  const email = form.querySelector('input[type="email"]').value;
  const betaInterest = form.querySelector('input[type="checkbox"]').checked;
  const timestamp = Date.now();

  // Create a unique key for this submission
  const submissionRef = database.ref('waitlist').push();

  // Data to save
  const submissionData = {
    email: email,
    betaInterest: betaInterest,
    timestamp: timestamp,
    formId: formId,
    date: new Date(timestamp).toISOString()
  };

  // Show loading state
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;
  submitButton.textContent = 'Submitting...';
  submitButton.disabled = true;

  // Save to Firebase
  submissionRef.set(submissionData)
    .then(() => {
      // Log analytics event
      analytics.logEvent('waitlist_signup', {
        form_id: formId,
        beta_interest: betaInterest
      });

      // Success feedback
      submitButton.textContent = 'Success!';
      submitButton.style.backgroundColor = '#3d7a4d';

      // Reset form
      form.reset();

      // Show success message
      showSuccessMessage(form);

      // Reset button after 3 seconds
      setTimeout(() => {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
        submitButton.style.backgroundColor = '';
      }, 3000);
    })
    .catch((error) => {
      console.error('Error saving to Firebase:', error);

      // Error feedback
      submitButton.textContent = 'Error - Try again';
      submitButton.style.backgroundColor = '#c44536';

      // Reset button after 3 seconds
      setTimeout(() => {
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
        submitButton.style.backgroundColor = '';
      }, 3000);
    });
}

// Show success message
function showSuccessMessage(form) {
  const successMessage = document.createElement('p');
  successMessage.className = 'success-message';
  successMessage.textContent = 'Brilliant! You\'re on the list. Check your email for confirmation.';
  successMessage.style.cssText = 'color: #3d7a4d; font-weight: 500; margin-top: 16px; text-align: center;';

  // Remove any existing success message
  const existingMessage = form.querySelector('.success-message');
  if (existingMessage) {
    existingMessage.remove();
  }

  form.appendChild(successMessage);

  // Remove success message after 5 seconds
  setTimeout(() => {
    successMessage.remove();
  }, 5000);
}

// Track page view
analytics.logEvent('page_view', {
  page_title: 'Coming Soon Landing Page',
  page_location: window.location.href
});

// Track scroll depth
let maxScrollDepth = 0;
window.addEventListener('scroll', () => {
  const scrollPercentage = Math.round((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100);

  if (scrollPercentage > maxScrollDepth) {
    maxScrollDepth = scrollPercentage;

    // Log scroll milestones
    if (maxScrollDepth >= 25 && maxScrollDepth < 50) {
      analytics.logEvent('scroll_depth_25');
    } else if (maxScrollDepth >= 50 && maxScrollDepth < 75) {
      analytics.logEvent('scroll_depth_50');
    } else if (maxScrollDepth >= 75 && maxScrollDepth < 100) {
      analytics.logEvent('scroll_depth_75');
    } else if (maxScrollDepth >= 100) {
      analytics.logEvent('scroll_depth_100');
    }
  }
});
