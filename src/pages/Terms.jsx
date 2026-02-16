import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, AlertCircle, Scale, Copyright, Ban } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
    
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-16">
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
              <Scale size={32} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold">Terms of Service</h1>
              <p className="text-white/90 mt-2">Last updated: February 15, 2026</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 md:p-12">
         
            <section className="mb-12">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Welcome to <strong className="text-primary-500">INKSTONE MEDIA</strong>. By accessing or using our website, you agree to be bound by these Terms of Service. Please read them carefully before using our services.
              </p>
            </section>

            <section className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <FileText className="text-blue-500" size={24} />
                </div>
                <h2 className="text-2xl font-heading font-bold">Agreement to Terms</h2>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg p-6">
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  By accessing and using INKSTONE MEDIA, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  We reserve the right to update, change, or replace any part of these Terms of Service by posting updates and/or changes to our website. It is your responsibility to check this page periodically for changes.
                </p>
              </div>
            </section>

       
            <section className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Copyright className="text-green-500" size={24} />
                </div>
                <h2 className="text-2xl font-heading font-bold">Use License</h2>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Permission is granted to temporarily access the materials (information or content) on INKSTONE MEDIA's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              
              <ul className="space-y-3 text-gray-700 dark:text-gray-300 ml-6">
                <li className="flex items-start space-x-3">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Modify or copy the materials</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Attempt to decompile or reverse engineer any software contained on INKSTONE MEDIA's website</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Remove any copyright or other proprietary notations from the materials</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Transfer the materials to another person or "mirror" the materials on any other server</span>
                </li>
              </ul>
            </section>

          
            <section className="mb-12">
              <h2 className="text-2xl font-heading font-bold mb-6">User Responsibilities</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="card p-4">
                  <h4 className="font-semibold mb-2 text-green-600 dark:text-green-400">✓ You Must</h4>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li>• Be at least 13 years old to use our services</li>
                    <li>• Provide accurate information</li>
                    <li>• Keep your account credentials secure</li>
                    <li>• Comply with all applicable laws</li>
                    <li>• Respect other users and their content</li>
                  </ul>
                </div>
                
                <div className="card p-4">
                  <h4 className="font-semibold mb-2 text-red-600 dark:text-red-400">✗ You Must Not</h4>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li>• Post harmful or offensive content</li>
                    <li>• Engage in spam or harassment</li>
                    <li>• Violate intellectual property rights</li>
                    <li>• Attempt to hack or disrupt services</li>
                    <li>• Impersonate others or misrepresent yourself</li>
                  </ul>
                </div>
              </div>
            </section>

         
            <section className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <AlertCircle className="text-purple-500" size={24} />
                </div>
                <h2 className="text-2xl font-heading font-bold">Content Guidelines</h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  When posting comments or submitting content to INKSTONE MEDIA, you agree not to post content that:
                </p>
                
                <div className="bg-gray-50 dark:bg-dark-800 rounded-lg p-6 space-y-3">
                  <div className="flex items-start space-x-3">
                    <Ban className="text-red-500 mt-1 flex-shrink-0" size={20} />
                    <p className="text-gray-700 dark:text-gray-300">
                      Is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Ban className="text-red-500 mt-1 flex-shrink-0" size={20} />
                    <p className="text-gray-700 dark:text-gray-300">
                      Infringes any patent, trademark, trade secret, copyright, or other proprietary rights
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Ban className="text-red-500 mt-1 flex-shrink-0" size={20} />
                    <p className="text-gray-700 dark:text-gray-300">
                      Contains software viruses or any other computer code designed to interrupt or harm functionality
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Ban className="text-red-500 mt-1 flex-shrink-0" size={20} />
                    <p className="text-gray-700 dark:text-gray-300">
                      Impersonates any person or entity or misrepresents your affiliation with a person or entity
                    </p>
                  </div>
                </div>
              </div>
            </section>

           
            <section className="mb-12">
              <h2 className="text-2xl font-heading font-bold mb-4">Disclaimer</h2>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-r-lg p-6">
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  The materials on INKSTONE MEDIA's website are provided on an 'as is' basis. INKSTONE MEDIA makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Further, INKSTONE MEDIA does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-heading font-bold mb-4">Limitations of Liability</h2>
              <p className="text-gray-700 dark:text-gray-300">
                In no event shall INKSTONE MEDIA or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on INKSTONE MEDIA's website, even if INKSTONE MEDIA or an authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

           
            <section className="mb-12">
              <h2 className="text-2xl font-heading font-bold mb-4">Accuracy of Materials</h2>
              <p className="text-gray-700 dark:text-gray-300">
                The materials appearing on INKSTONE MEDIA's website could include technical, typographical, or photographic errors. INKSTONE MEDIA does not warrant that any of the materials on its website are accurate, complete, or current. INKSTONE MEDIA may make changes to the materials contained on its website at any time without notice.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-heading font-bold mb-4">Links to Third-Party Sites</h2>
              <p className="text-gray-700 dark:text-gray-300">
                INKSTONE MEDIA has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by INKSTONE MEDIA of the site. Use of any such linked website is at the user's own risk.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-heading font-bold mb-4">Modifications</h2>
              <p className="text-gray-700 dark:text-gray-300">
                INKSTONE MEDIA may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then-current version of these terms of service.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-heading font-bold mb-4">Governing Law</h2>
              <p className="text-gray-700 dark:text-gray-300">
                These terms and conditions are governed by and construed in accordance with the laws of Nigeria, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>

          
            <section className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-8">
              <h2 className="text-2xl font-heading font-bold mb-4">Questions?</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              
              <div className="space-y-2 text-gray-700 dark:text-gray-300 mb-6">
                <p><strong>Email:</strong> legal@inkstonemedia.com</p>
                <p><strong>Phone:</strong> +234 704 6678 039</p>
              </div>
              
              <Link to="/contact" className="btn-primary inline-block">
                Contact Us
              </Link>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;