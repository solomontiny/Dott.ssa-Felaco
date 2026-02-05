import React from 'react';
import { HelpCircle, CheckCircle } from 'lucide-react';

const QASection = () => {
  return (
    <section id="qa" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-teal-600 font-medium tracking-wider text-sm mb-4">
            CLIENT SUCCESS STORY
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
            Questions & Answers
          </h2>
          <p className="text-xl text-gray-600">
            Real insights from a real transformation journey
          </p>
        </div>

        <div className="space-y-8">
          {/* Q1 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-teal-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  ❓ Q1. What was the main concern of this client?
                </h3>
                <div className="pl-4 border-l-4 border-teal-200">
                  <p className="text-lg text-gray-700 mb-1 font-medium">A:</p>
                  <p className="text-gray-700 leading-relaxed">
                    The client came to me feeling tired, bloated, and confused about food. Living in Naples, they followed a traditional diet but struggled with portion control, irregular meals, and emotional eating due to stress and work routine.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Q2 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-teal-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  ❓ Q2. Did the client need to give up Italian food?
                </h3>
                <div className="pl-4 border-l-4 border-teal-200">
                  <p className="text-lg text-gray-700 mb-1 font-medium">A:</p>
                  <p className="text-gray-700 leading-relaxed">
                    Absolutely not. One of the biggest goals was to respect local food culture. Pasta, bread, olive oil, and traditional meals were included — with better balance, timing, and awareness. Sustainable nutrition means adapting habits, not eliminating culture.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Q3 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-teal-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  ❓ Q3. What approach did you use?
                </h3>
                <div className="pl-4 border-l-4 border-teal-200">
                  <p className="text-lg text-gray-700 mb-1 font-medium">A:</p>
                  <p className="text-gray-700 leading-relaxed">
                    I used a personalised approach based on nutritional education, habit-building, and lifestyle analysis. Instead of strict diets, we focused on understanding hunger signals, meal structure, and realistic routines suited to life in Naples.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Q4 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-teal-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  ❓ Q4. How important was mindset in this case?
                </h3>
                <div className="pl-4 border-l-4 border-teal-200">
                  <p className="text-lg text-gray-700 mb-1 font-medium">A:</p>
                  <p className="text-gray-700 leading-relaxed">
                    Mindset was essential. The client had tried many diets before and felt frustrated. Working on the mental relationship with food helped reduce guilt, stress, and emotional eating. When mindset improves, consistency becomes easier.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Q5 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-teal-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  ❓ Q5. Was physical activity included?
                </h3>
                <div className="pl-4 border-l-4 border-teal-200">
                  <p className="text-lg text-gray-700 mb-1 font-medium">A:</p>
                  <p className="text-gray-700 leading-relaxed">
                    Yes, but in a realistic way. We introduced regular movement such as walking, light gym sessions, and daily activity — not extreme training. The goal was to improve energy, mood, and overall well-being, not just weight.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Q6 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-teal-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  ❓ Q6. How long did it take to see results?
                </h3>
                <div className="pl-4 border-l-4 border-teal-200">
                  <p className="text-lg text-gray-700 mb-1 font-medium">A:</p>
                  <p className="text-gray-700 leading-relaxed">
                    The client started noticing improvements in energy, digestion, and focus within the first few weeks. Long-term changes developed gradually through consistency, education, and personalised guidance.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Q7 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-teal-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  ❓ Q7. What makes this approach different from standard diets?
                </h3>
                <div className="pl-4 border-l-4 border-teal-200">
                  <p className="text-lg text-gray-700 mb-1 font-medium">A:</p>
                  <p className="text-gray-700 leading-relaxed">
                    This method focuses on self-knowledge, flexibility, and sustainability. There are no rigid rules, no forbidden foods, and no one-size-fits-all plans. Each pathway is built around the person, their culture, and their real life.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Q8 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-teal-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  ❓ Q8. Who is this type of program best for?
                </h3>
                <div className="pl-4 border-l-4 border-teal-200">
                  <p className="text-lg text-gray-700 mb-1 font-medium">A:</p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    This approach is ideal for people who:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Feel tired of strict diets</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Want to eat better without stress</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Live busy lives</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Want long-term health, not quick fixes</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center p-8 bg-teal-50 rounded-2xl border border-teal-100">
          <h3 className="text-2xl font-serif text-gray-900 mb-3">
            Ready to Start Your Journey?
          </h3>
          <p className="text-gray-700 mb-6">
            Every transformation starts with understanding, education, and personalised support.
          </p>
          <button
            onClick={() => {
              const element = document.querySelector('#consultation');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 hover:shadow-lg inline-flex items-center space-x-2"
          >
            <span>Book Your Free Consultation</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default QASection;
