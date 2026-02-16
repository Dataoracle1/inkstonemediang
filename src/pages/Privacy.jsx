import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, UserCheck, FileText, Mail } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
     
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-16">
        <div className="container mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-white/90 hover:text-white mb-6 transition"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Shield size={32} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold">Privacy Policy</h1>
              <p className="text-white/90 mt-2">Last updated: February 15, 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 md:p-12">
            {/* Introduction */}
            <section className="mb-12">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                At <strong className="text-primary-500">INKSTONE MEDIA</strong>, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                  <FileText className="text-primary-500" size={24} />
                </div>
                <h2 className="text-2xl font-heading font-bold">Information We Collect</h2>
              </div>
              
              <div className="space-y-6">
                <div className="pl-6 border-l-4 border-primary-500">
                  <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    We may collect personal information that you voluntarily provide to us when you:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li>Subscribe to our newsletter</li>
                    <li>Submit comments on articles</li>
                    <li>Contact us through our contact form</li>
                   
                  </ul>
                  <p className="text-gray-700 dark:text-gray-300 mt-3">
                    This may include your name, email address, phone number, and any other information you choose to provide.
                  </p>
                </div>

                <div className="pl-6 border-l-4 border-blue-500">
                  <h3 className="text-xl font-semibold mb-3">Automatically Collected Information</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    When you visit our website, we automatically collect certain information about your device, including:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li>IP address and browser type</li>
                    <li>Operating system and device information</li>
                    <li>Pages visited and time spent on pages</li>
                    <li>Referring website addresses</li>
                    <li>Cookie data and unique identifiers</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <UserCheck className="text-green-500" size={24} />
                </div>
                <h2 className="text-2xl font-heading font-bold">How We Use Your Information</h2>
              </div>
              
              <div className="bg-gray-50 dark:bg-dark-800 rounded-lg p-6">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We use the information we collect to:
                </p>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start space-x-3">
                    <span className="text-primary-500 mt-1">✓</span>
                    <span>Provide, operate, and maintain our website and services</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-primary-500 mt-1">✓</span>
                    <span>Send you newsletters, updates, and promotional materials (with your consent)</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-primary-500 mt-1">✓</span>
                    <span>Respond to your comments, questions, and provide customer support</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-primary-500 mt-1">✓</span>
                    <span>Analyze usage patterns and improve our content and user experience</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-primary-500 mt-1">✓</span>
                    <span>Detect, prevent, and address technical issues or fraudulent activity</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-primary-500 mt-1">✓</span>
                    <span>Comply with legal obligations and protect our rights</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Cookies and Tracking */}
            <section className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <Eye className="text-orange-500" size={24} />
                </div>
                <h2 className="text-2xl font-heading font-bold">Cookies and Tracking Technologies</h2>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are small data files stored on your device.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-300">Essential Cookies</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Required for the website to function properly. These cannot be disabled.
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-purple-900 dark:text-purple-300">Analytics Cookies</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Help us understand how visitors interact with our website.
                  </p>
                </div>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300">
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
              </p>
            </section>

            {/* Data Security */}
            <section className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <Lock className="text-red-500" size={24} />
                </div>
                <h2 className="text-2xl font-heading font-bold">Data Security</h2>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg p-6">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  However, please note that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
                </p>
              </div>
            </section>

            {/* Your Rights */}
            <section className="mb-12">
              <h2 className="text-2xl font-heading font-bold mb-6">Your Privacy Rights</h2>
              
              <div className="space-y-4">
                <div className="card p-4">
                  <h4 className="font-semibold mb-2">Access and Portability</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    You have the right to request a copy of the personal information we hold about you.
                  </p>
                </div>
                
                <div className="card p-4">
                  <h4 className="font-semibold mb-2">Correction</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    You can request that we correct any inaccurate or incomplete personal information.
                  </p>
                </div>
                
                <div className="card p-4">
                  <h4 className="font-semibold mb-2">Deletion</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    You may request that we delete your personal information, subject to certain legal exceptions.
                  </p>
                </div>
                
                <div className="card p-4">
                  <h4 className="font-semibold mb-2">Opt-Out</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    You can unsubscribe from our marketing communications at any time by clicking the unsubscribe link in our emails.
                  </p>
                </div>
              </div>
            </section>

            {/* Third-Party Links */}
            <section className="mb-12">
              <h2 className="text-2xl font-heading font-bold mb-4">Third-Party Links</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Our website may contain links to third-party websites that are not operated by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services. We encourage you to review the privacy policy of every site you visit.
              </p>
            </section>

           

            {/* Changes to Privacy Policy */}
            <section className="mb-12">
              <h2 className="text-2xl font-heading font-bold mb-4">Changes to This Privacy Policy</h2>
              <p className="text-gray-700 dark:text-gray-300">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

           
            <section className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-8">
              <div className="flex items-center space-x-3 mb-4">
                <Mail className="text-primary-500" size={32} />
                <h2 className="text-2xl font-heading font-bold">Contact Us</h2>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p><strong>Email:</strong> privacy@inkstonemedia.com</p>
                <p><strong>Phone:</strong> +234 704 6678 039</p>
                <p><strong>Address:</strong> 123 Media Avenue, Victoria Island, Lagos, Nigeria</p>
              </div>
              
              <div className="mt-6">
                <Link to="/contact" className="btn-primary inline-flex items-center space-x-2">
                  <Mail size={18} />
                  <span>Send Us a Message</span>
                </Link>
              </div>
            </section>

          
            <section className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                By using our website, you hereby consent to our Privacy Policy and agree to its terms.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;