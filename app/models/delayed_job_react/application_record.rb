if defined?(ActiveRecord)
  module DelayedJobReact
    class ApplicationRecord < ActiveRecord::Base
      self.abstract_class = true
    end
  end
else
  module DelayedJobReact
    class ApplicationRecord
    end
  end
end
